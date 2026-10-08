import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronSecretGuard } from './cron-secret.guard.js';

const SECRETO = 's'.repeat(40);
const guard = new CronSecretGuard({
  get: () => SECRETO,
} as unknown as ConfigService<any, true>);

const contexto = (headers: Record<string, string>) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  }) as unknown as ExecutionContext;

describe('CronSecretGuard', () => {
  it('permite la llamada con el secreto correcto', () => {
    expect(guard.canActivate(contexto({ 'x-cron-secret': SECRETO }))).toBe(
      true,
    );
  });

  it('rechaza con 401 si el secreto es incorrecto', () => {
    expect(() =>
      guard.canActivate(contexto({ 'x-cron-secret': 'otro' })),
    ).toThrow(UnauthorizedException);
  });

  it('rechaza con 401 si falta la cabecera', () => {
    expect(() => guard.canActivate(contexto({}))).toThrow(
      UnauthorizedException,
    );
  });
});
