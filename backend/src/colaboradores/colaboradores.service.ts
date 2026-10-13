import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import type { Colaborador, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  ActualizarColaboradorDto,
  CrearColaboradorDto,
  FiltroColaboradoresDto,
} from './dto/colaborador.dto.js';
import { validarCsvColaboradores } from './importacion-csv.js';

export interface Pagina<T> {
  datos: T[];
  total: number;
  pagina: number;
  porPagina: number;
}

const CAMPOS_AUDITADOS = [
  'nombres',
  'apellidos',
  'email',
  'rol',
  'edad',
  'hijos',
  'claseRiesgoArl',
  'activo',
] as const;

@Injectable()
export class ColaboradoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoria: AuditoriaService,
  ) {}

  /** HU-10: listado paginado con búsqueda y filtros. */
  async listar(
    empresaId: string,
    filtro: FiltroColaboradoresDto,
  ): Promise<Pagina<Colaborador>> {
    const pagina = filtro.pagina ?? 1;
    const porPagina = filtro.porPagina ?? 20;
    const estado = filtro.estado ?? 'activos';
    const q = filtro.q?.trim();
    const where: Prisma.ColaboradorWhereInput = {
      empresaId,
      ...(estado !== 'todos' && { activo: estado === 'activos' }),
      ...(filtro.rol && { rol: filtro.rol }),
      ...(q && {
        OR: [
          { nombres: { contains: q, mode: 'insensitive' } },
          { apellidos: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };
    const [datos, total] = await this.prisma.$transaction([
      this.prisma.colaborador.findMany({
        where,
        orderBy: [{ apellidos: 'asc' }, { nombres: 'asc' }],
        skip: (pagina - 1) * porPagina,
        take: porPagina,
      }),
      this.prisma.colaborador.count({ where }),
    ]);
    return { datos, total, pagina, porPagina };
  }

  async obtener(empresaId: string, id: string): Promise<Colaborador> {
    const colaborador = await this.prisma.colaborador.findFirst({
      where: { id, empresaId },
    });
    if (!colaborador) throw new NotFoundException('Colaborador no encontrado');
    return colaborador;
  }

  /** HU-09 */
  async crear(
    empresaId: string,
    dto: CrearColaboradorDto,
    actorId: string,
  ): Promise<Colaborador> {
    await this.verificarEmailLibre(empresaId, dto.email);
    const colaborador = await this.prisma.colaborador.create({
      data: { ...dto, empresaId },
    });
    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: 'CREAR',
      entidad: 'Colaborador',
      entidadId: colaborador.id,
      despues: resumen(colaborador),
    });
    return colaborador;
  }

  /** HU-09: los cambios de rol, hijos, etc. quedan en auditoría con el valor anterior y el nuevo. */
  async actualizar(
    empresaId: string,
    id: string,
    dto: ActualizarColaboradorDto,
    actorId: string,
  ): Promise<Colaborador> {
    const anterior = await this.obtener(empresaId, id);
    if (dto.email && dto.email !== anterior.email)
      await this.verificarEmailLibre(empresaId, dto.email);
    const actualizado = await this.prisma.colaborador.update({
      where: { id },
      data: dto,
    });
    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: dto.activo === false ? 'DESACTIVAR' : 'ACTUALIZAR',
      entidad: 'Colaborador',
      entidadId: id,
      antes: resumen(anterior),
      despues: resumen(actualizado),
    });
    return actualizado;
  }

  /** HU-09: desactivar conserva el histórico y lo excluye de próximas liquidaciones. */
  desactivar(
    empresaId: string,
    id: string,
    actorId: string,
  ): Promise<Colaborador> {
    return this.actualizar(empresaId, id, { activo: false }, actorId);
  }

  /** HU-07 / HU-08: valida el archivo e indica si cada fila válida crea o actualiza. */
  async previsualizar(empresaId: string, archivo: Buffer) {
    const resultado = validarCsvColaboradores(archivo);
    const existentes = new Set(
      (
        await this.prisma.colaborador.findMany({
          where: {
            empresaId,
            email: { in: resultado.validas.map((v) => v.datos.email) },
          },
          select: { email: true },
        })
      ).map((c) => c.email),
    );
    return {
      total: resultado.total,
      validas: resultado.validas.map((v) => ({
        ...v,
        accion: existentes.has(v.datos.email)
          ? ('actualizar' as const)
          : ('crear' as const),
      })),
      invalidas: resultado.invalidas,
    };
  }

  /** HU-07: importa las filas válidas en una sola transacción (crea nuevos, actualiza por email). */
  async importar(empresaId: string, archivo: Buffer, actorId: string) {
    const vista = await this.previsualizar(empresaId, archivo);
    await this.prisma.$transaction(
      vista.validas.map(({ datos }) =>
        this.prisma.colaborador.upsert({
          where: { empresaId_email: { empresaId, email: datos.email } },
          create: { ...datos, empresaId },
          update: { ...datos, activo: true },
        }),
      ),
    );
    const resumenImportacion = {
      creados: vista.validas.filter((v) => v.accion === 'crear').length,
      actualizados: vista.validas.filter((v) => v.accion === 'actualizar')
        .length,
      rechazados: vista.invalidas.length,
    };
    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: 'IMPORTAR_CSV',
      entidad: 'Colaborador',
      despues: {
        ...resumenImportacion,
        filasRechazadas: vista.invalidas.map((i) => i.fila),
      },
    });
    return resumenImportacion;
  }

  private async verificarEmailLibre(
    empresaId: string,
    email: string,
  ): Promise<void> {
    const existe = await this.prisma.colaborador.findUnique({
      where: { empresaId_email: { empresaId, email } },
    });
    if (existe)
      throw new ConflictException('Ya existe un colaborador con ese email');
  }
}

function resumen(c: Colaborador) {
  return Object.fromEntries(CAMPOS_AUDITADOS.map((k) => [k, c[k]]));
}
