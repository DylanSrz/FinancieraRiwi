import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { RolUsuario } from '../../generated/prisma/enums.js';
import type { UsuarioAutenticado } from '../../auth/auth.types.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requeridos = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requeridos?.length) return true;
    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: UsuarioAutenticado }>();
    return !!user && requeridos.includes(user.rol);
  }
}
