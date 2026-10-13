import { createHash, randomBytes } from 'node:crypto';

/** Token opaco aleatorio (256 bits) para refresh, invitación y recuperación. */
export function generarToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Solo se guarda el hash SHA-256 del token, nunca el valor en claro (ADR-004). */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export const COOKIE_REFRESH = 'nomina_rt';
export const MAX_INTENTOS_FALLIDOS = 5;
export const MINUTOS_BLOQUEO = 15;
export const HORAS_INVITACION = 48;
