import { validateEnv } from './env.validation.js';

const base = {
  FRONTEND_URL: 'http://localhost:5173',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/nomina',
  JWT_ACCESS_SECRET: 'x'.repeat(32),
  CRON_SECRET: 'y'.repeat(32),
};

describe('validateEnv', () => {
  it('acepta una configuración mínima válida y aplica valores por defecto', () => {
    const env = validateEnv(base);
    expect(env.PORT).toBe(3000);
    expect(env.JWT_ACCESS_EXPIRES_IN).toBe('15m');
    expect(env.REFRESH_TOKEN_DIAS).toBe(7);
  });

  it('rechaza un secreto JWT demasiado corto', () => {
    expect(() => validateEnv({ ...base, JWT_ACCESS_SECRET: 'corto' })).toThrow(
      /JWT_ACCESS_SECRET/,
    );
  });

  it('rechaza si falta DATABASE_URL', () => {
    const { DATABASE_URL: _omitida, ...sinDb } = base;
    expect(() => validateEnv(sinDb)).toThrow(/DATABASE_URL/);
  });
});
