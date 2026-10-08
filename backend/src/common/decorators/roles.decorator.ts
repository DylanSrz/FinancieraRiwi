import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../generated/prisma/enums.js';

export const ROLES_KEY = 'roles';

/** Restringe un endpoint a uno o más roles de usuario. */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
