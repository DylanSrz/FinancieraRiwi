/**
 * Datos iniciales: empresa, parámetros legales 2026, valores hora, bonificaciones y usuario administrador.
 * Uso: npx prisma db seed   (requiere DATABASE_URL, SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD)
 * Es idempotente: se puede ejecutar varias veces.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PARAMETROS_2026 as P } from '../src/liquidacion/domain/parametros-2026.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const VIGENCIA = new Date('2026-01-01');

async function main() {
  const empresa = await prisma.empresa.upsert({
    where: { nit: '900000000-1' },
    update: {},
    create: { nombre: 'Financiera Riwi', nit: '900000000-1' },
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
          rol: rol as keyof typeof P.valorHora,
          vigenteDesde: VIGENCIA,
        },
      },
      update: {},
      create: {
        empresaId: empresa.id,
        rol: rol as keyof typeof P.valorHora,
        valorHora,
        vigenteDesde: VIGENCIA,
      },
    });
  }

  for (const [hijos, valor] of Object.entries(P.bonificacionHijos)) {
    await prisma.bonificacionHijos.upsert({
      where: {
        empresaId_hijos_vigenteDesde: {
          empresaId: empresa.id,
          hijos: Number(hijos),
          vigenteDesde: VIGENCIA,
        },
      },
      update: {},
      create: {
        empresaId: empresa.id,
        hijos: Number(hijos),
        valor,
        vigenteDesde: VIGENCIA,
      },
    });
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    await prisma.usuario.upsert({
      where: { email },
      update: {},
      create: {
        empresaId: empresa.id,
        nombre: 'Administrador',
        email,
        passwordHash: await bcrypt.hash(password, 12),
        rol: 'ADMIN',
        estado: 'ACTIVO',
        emailVerificado: true,
      },
    });
  } else {
    console.warn(
      'SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD no definidos: no se creó el administrador.',
    );
  }

  console.log(`Seed completado para ${empresa.nombre}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
