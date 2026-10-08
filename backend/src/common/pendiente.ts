import { NotImplementedException } from '@nestjs/common';

/**
 * Marca un punto de extensión que se implementa en una historia de usuario del backlog.
 * Responde 501 para que el contrato de la API sea visible en Swagger desde el Sprint 0.
 */
export function pendiente(historia: string): never {
  throw new NotImplementedException(`Pendiente de implementar (${historia})`);
}
