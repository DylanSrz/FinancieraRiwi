// Variables mínimas para levantar la app en pruebas e2e (sin servicios externos).
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL ??= 'http://localhost:5173';
process.env.DATABASE_URL ??= 'postgresql://usuario:clave@localhost:5432/nomina';
process.env.JWT_ACCESS_SECRET ??= 'e2e-secreto-de-pruebas-0123456789abcdef';
process.env.CRON_SECRET ??= 'e2e-cron-secreto-0123456789abcdef0123';
