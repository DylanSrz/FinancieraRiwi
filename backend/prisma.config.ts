import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma CLI (migraciones) usa la conexión directa de Supabase (puerto 5432).
// La aplicación usa DATABASE_URL (pooler, puerto 6543) a través de @prisma/adapter-pg.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? '',
  },
});
