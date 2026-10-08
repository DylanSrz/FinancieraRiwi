import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';

function contexto(user?: { rol: string }): ExecutionContext {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('permite el acceso si el endpoint no exige roles', () => {
    const reflector = {
      getAllAndOverride: () => undefined,
    } as unknown as Reflector;
    expect(new RolesGuard(reflector).canActivate(contexto())).toBe(true);
  });

  it('permite el acceso si el usuario tiene el rol requerido', () => {
    const reflector = {
      getAllAndOverride: () => ['ADMIN'],
    } as unknown as Reflector;
    expect(
      new RolesGuard(reflector).canActivate(contexto({ rol: 'ADMIN' })),
    ).toBe(true);
  });

  it('niega el acceso si el usuario no tiene el rol requerido', () => {
    const reflector = {
      getAllAndOverride: () => ['ADMIN'],
    } as unknown as Reflector;
    expect(
      new RolesGuard(reflector).canActivate(contexto({ rol: 'AUX_CONTABLE' })),
    ).toBe(false);
  });
});
