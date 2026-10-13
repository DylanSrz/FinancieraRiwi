// Las pruebas e2e usan una base de datos propia (se vacía en cada archivo de pruebas).
// Local: crea la BD `nomina_test` y aplica migraciones (ver docs/guias/configuracion-local.md).
const BD_PRUEBAS =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/nomina_test';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = BD_PRUEBAS;
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.JWT_ACCESS_SECRET = 'e2e-secreto-de-pruebas-0123456789abcdef';
process.env.CRON_SECRET = 'e2e-cron-secreto-0123456789abcdef0123';
process.env.RESEND_API_KEY = '';
process.env.GOOGLE_CLIENT_ID = '';
