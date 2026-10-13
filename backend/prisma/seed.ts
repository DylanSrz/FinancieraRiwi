/**
 * Datos iniciales: empresa, parámetros legales 2026, valores hora, bonificaciones y usuario administrador.
 * Uso: npm run prisma:seed   (requiere DATABASE_URL, SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD)
 * Es idempotente: se puede ejecutar varias veces.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { sembrarDatosBase } from '../src/prisma/datos-base.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const { empresa, admin } = await sembrarDatosBase(prisma, {
    adminEmail: process.env.SEED_ADMIN_EMAIL,
    adminPassword: process.env.SEED_ADMIN_PASSWORD,
  });
  if (!admin) {
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
