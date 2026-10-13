import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { aNumero } from '../common/decimal.js';
import type { ParametroLegal } from '../generated/prisma/client.js';
import { RolColaborador } from '../generated/prisma/enums.js';
import type {
  ParametrosLiquidacion,
  TramoFsp,
} from '../liquidacion/domain/tipos.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ParametrosLegalesDto } from './dto/parametros-legales.dto.js';
import type { NuevoValorHoraDto } from './dto/valor-hora.dto.js';

export type ParametrosLegalesVista = ParametrosLegalesDto & {
  anio: number;
  actualizadoEn: Date;
};

@Injectable()
export class ParametrosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoria: AuditoriaService,
  ) {}

  // ------------------------------------------------------------ HU-21 parámetros legales

  async aniosConfigurados(empresaId: string): Promise<number[]> {
    const filas = await this.prisma.parametroLegal.findMany({
      where: { empresaId },
      select: { anio: true },
      orderBy: { anio: 'desc' },
    });
    return filas.map((f) => f.anio);
  }

  async obtenerLegales(
    empresaId: string,
    anio: number,
  ): Promise<ParametrosLegalesVista> {
    const fila = await this.prisma.parametroLegal.findUnique({
      where: { empresaId_anio: { empresaId, anio } },
    });
    if (!fila)
      throw new NotFoundException(
        `No hay parámetros legales para el año ${anio}`,
      );
    return aVista(fila);
  }

  async guardarLegales(
    empresaId: string,
    anio: number,
    dto: ParametrosLegalesDto,
    usuarioId: string,
  ): Promise<ParametrosLegalesVista> {
    const anterior = await this.prisma.parametroLegal.findUnique({
      where: { empresaId_anio: { empresaId, anio } },
    });
    const datos = { ...dto, fspTramos: dto.fspTramos as object[] };
    const fila = await this.prisma.parametroLegal.upsert({
      where: { empresaId_anio: { empresaId, anio } },
      update: datos,
      create: { ...datos, empresaId, anio },
    });
    await this.auditoria.registrar({
      empresaId,
      usuarioId,
      accion: anterior ? 'ACTUALIZAR' : 'CREAR',
      entidad: 'ParametroLegal',
      entidadId: String(anio),
      antes: anterior ? (aVista(anterior) as object) : undefined,
      despues: aVista(fila) as object,
    });
    return aVista(fila);
  }

  // ------------------------------------------------------------ HU-22 valores hora

  async valoresHora(empresaId: string, fecha = new Date()) {
    const historico = await this.prisma.valorHoraRol.findMany({
      where: { empresaId },
      orderBy: [{ rol: 'asc' }, { vigenteDesde: 'desc' }],
    });
    const vigentes = Object.values(RolColaborador).map((rol) => {
      const vigente = historico.find(
        (v) => v.rol === rol && v.vigenteDesde <= fecha,
      );
      return {
        rol,
        valorHora: vigente ? aNumero(vigente.valorHora) : null,
        vigenteDesde: vigente?.vigenteDesde ?? null,
      };
    });
    return {
      vigentes,
      historico: historico.map((v) => ({
        id: v.id,
        rol: v.rol,
        valorHora: aNumero(v.valorHora),
        vigenteDesde: v.vigenteDesde,
        creadoEn: v.createdAt,
      })),
    };
  }

  async nuevoValorHora(
    empresaId: string,
    dto: NuevoValorHoraDto,
    usuarioId: string,
  ) {
    const vigenteDesde = new Date(dto.vigenteDesde);
    const existente = await this.prisma.valorHoraRol.findUnique({
      where: {
        empresaId_rol_vigenteDesde: { empresaId, rol: dto.rol, vigenteDesde },
      },
    });
    if (existente) {
      throw new ConflictException(
        `Ya existe un valor hora para ${dto.rol} vigente desde ${dto.vigenteDesde}`,
      );
    }
    const fila = await this.prisma.valorHoraRol.create({
      data: { empresaId, rol: dto.rol, valorHora: dto.valorHora, vigenteDesde },
    });
    await this.auditoria.registrar({
      empresaId,
      usuarioId,
      accion: 'CREAR',
      entidad: 'ValorHoraRol',
      entidadId: fila.id,
      despues: {
        rol: dto.rol,
        valorHora: dto.valorHora,
        vigenteDesde: dto.vigenteDesde,
      },
    });
    return {
      id: fila.id,
      rol: fila.rol,
      valorHora: aNumero(fila.valorHora),
      vigenteDesde,
    };
  }

  async bonificaciones(empresaId: string, fecha = new Date()) {
    const filas = await this.prisma.bonificacionHijos.findMany({
      where: { empresaId, vigenteDesde: { lte: fecha } },
      orderBy: [{ hijos: 'asc' }, { vigenteDesde: 'desc' }],
    });
    return [1, 2, 3].map((hijos) => {
      const vigente = filas.find((f) => f.hijos === hijos);
      return {
        hijos,
        valor: vigente ? aNumero(vigente.valor) : 0,
        vigenteDesde: vigente?.vigenteDesde ?? null,
      };
    });
  }

  // ------------------------------------------------------------ RN-16 parámetros para el motor

  /**
   * Arma los parámetros del motor de liquidación para una fecha de corte:
   * legales del año de la fecha + valor hora y bonificación vigentes en esa fecha.
   */
  async paraLiquidar(
    empresaId: string,
    fechaCorte: Date,
  ): Promise<ParametrosLiquidacion> {
    const anio = fechaCorte.getUTCFullYear();
    const legales = await this.obtenerLegales(empresaId, anio);
    const { vigentes } = await this.valoresHora(empresaId, fechaCorte);
    const sinValor = vigentes
      .filter((v) => v.valorHora === null)
      .map((v) => v.rol);
    if (sinValor.length) {
      throw new NotFoundException(
        `No hay valor hora vigente para: ${sinValor.join(', ')}`,
      );
    }
    const bonif = await this.bonificaciones(empresaId, fechaCorte);
    return {
      valorHora: Object.fromEntries(
        vigentes.map((v) => [v.rol, v.valorHora]),
      ) as ParametrosLiquidacion['valorHora'],
      bonificacionHijos: {
        1: bonif[0].valor,
        2: bonif[1].valor,
        3: bonif[2].valor,
      },
      smmlv: legales.smmlv,
      auxilioTransporte: legales.auxilioTransporte,
      topeAuxilioSmmlv: legales.topeAuxilioSmmlv,
      saludEmpleado: legales.saludEmpleado,
      pensionEmpleado: legales.pensionEmpleado,
      fspTramos: legales.fspTramos as TramoFsp[],
      saludEmpleador: legales.saludEmpleador,
      pensionEmpleador: legales.pensionEmpleador,
      cajaCompensacion: legales.cajaCompensacion,
      icbf: legales.icbf,
      sena: legales.sena,
      topeExoneracionSmmlv: legales.topeExoneracionSmmlv,
      arlTarifas: legales.arlTarifas,
    };
  }
}

function aVista(f: ParametroLegal): ParametrosLegalesVista {
  return {
    anio: f.anio,
    smmlv: aNumero(f.smmlv),
    auxilioTransporte: aNumero(f.auxilioTransporte),
    topeAuxilioSmmlv: aNumero(f.topeAuxilioSmmlv),
    saludEmpleado: aNumero(f.saludEmpleado),
    pensionEmpleado: aNumero(f.pensionEmpleado),
    saludEmpleador: aNumero(f.saludEmpleador),
    pensionEmpleador: aNumero(f.pensionEmpleador),
    cajaCompensacion: aNumero(f.cajaCompensacion),
    icbf: aNumero(f.icbf),
    sena: aNumero(f.sena),
    topeExoneracionSmmlv: aNumero(f.topeExoneracionSmmlv),
    horasMaxMes: aNumero(f.horasMaxMes),
    fspTramos: f.fspTramos as unknown as ParametrosLegalesDto['fspTramos'],
    arlTarifas: f.arlTarifas as Record<string, number>,
    actualizadoEn: f.updatedAt,
  };
}
