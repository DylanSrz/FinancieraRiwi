import bcrypt from 'bcryptjs';
import { PARAMETROS_2026 as P } from '../liquidacion/domain/parametros-2026.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { RolColaborador } from '../generated/prisma/enums.js';

export const NIT_EMPRESA_BASE = '900000000-1';
export const VIGENCIA_INICIAL = new Date('2026-01-01');

export interface OpcionesDatosBase {
  adminEmail?: string;
  adminPassword?: string;
}

/**
 * Datos iniciales idempotentes: empresa, parámetros legales 2026, valores hora, bonificaciones
 * y (opcional) el usuario administrador. Lo usan el seed y las pruebas e2e.
 */
export async function sembrarDatosBase(
  prisma: PrismaClient,
  opciones: OpcionesDatosBase = {},
) {
  const empresa = await prisma.empresa.upsert({
    where: { nit: NIT_EMPRESA_BASE },
    update: {},
    create: { nombre: 'Financiera Riwi', nit: NIT_EMPRESA_BASE },
  });

  await prisma.parametroLegal.upsert({
    where: { empresaId_anio: { empresaId: empresa.id, anio: 2026 } },
    update: {},
    create: {
      empresaId: empresa.id,
      anio: 2026,
      smmlv: P.smmlv,
      auxilioTransporte: P.auxilioTransporte,
      topeAuxilioSmmlv: P.topeAuxilioSmmlv,
      saludEmpleado: P.saludEmpleado,
      pensionEmpleado: P.pensionEmpleado,
      saludEmpleador: P.saludEmpleador,
      pensionEmpleador: P.pensionEmpleador,
      cajaCompensacion: P.cajaCompensacion,
      icbf: P.icbf,
      sena: P.sena,
      topeExoneracionSmmlv: P.topeExoneracionSmmlv,
      horasMaxMes: 180,
      fspTramos: P.fspTramos as object[],
      arlTarifas: P.arlTarifas,
    },
  });

  for (const [rol, valorHora] of Object.entries(P.valorHora)) {
    await prisma.valorHoraRol.upsert({
      where: {
        empresaId_rol_vigenteDesde: {
          empresaId: empresa.id,
          rol: rol as RolColaborador,
          vigenteDesde: VIGENCIA_INICIAL,
        },
      },
      update: {},
      create: {
        empresaId: empresa.id,
        rol: rol as RolColaborador,
        valorHora,
        vigenteDesde: VIGENCIA_INICIAL,
      },
    });
  }

  for (const [hijos, valor] of Object.entries(P.bonificacionHijos)) {
    await prisma.bonificacionHijos.upsert({
      where: {
        empresaId_hijos_vigenteDesde: {
          empresaId: empresa.id,
          hijos: Number(hijos),
          vigenteDesde: VIGENCIA_INICIAL,
        },
      },
      update: {},
      create: {
        empresaId: empresa.id,
        hijos: Number(hijos),
        valor,
        vigenteDesde: VIGENCIA_INICIAL,
      },
    });
  }

  let admin = null;
  if (opciones.adminEmail && opciones.adminPassword) {
    admin = await prisma.usuario.upsert({
      where: { email: opciones.adminEmail.toLowerCase() },
      update: {},
      create: {
        empresaId: empresa.id,
        nombre: 'Administrador',
        email: opciones.adminEmail.toLowerCase(),
        passwordHash: await bcrypt.hash(opciones.adminPassword, 12),
        rol: 'ADMIN',
        estado: 'ACTIVO',
        emailVerificado: true,
      },
    });
  }

  return { empresa, admin };
}
