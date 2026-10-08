import type { RolUsuario } from '../generated/prisma/enums.js';

/** Contenido del access token (JWT). */
export interface JwtPayload {
  sub: string;
  empresaId: string;
  email: string;
  rol: RolUsuario;
}

/** Usuario disponible en `request.user` después de validar el JWT. */
export type UsuarioAutenticado = JwtPayload;

export interface ParDeTokens {
  accessToken: string;
  /** Se entrega en una cookie httpOnly, nunca en el cuerpo de la respuesta. */
  refreshToken: string;
}
