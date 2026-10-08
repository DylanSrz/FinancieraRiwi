import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Env } from '../../config/env.validation.js';

export const CABECERA_CRON = 'x-cron-secret';

/** Protege el endpoint que invoca pg_cron (ADR-007). Compara en tiempo constante. */
@Injectable()
export class CronSecretGuard implements CanActivate {
  private readonly esperado: Buffer;

  constructor(config: ConfigService<Env, true>) {
    this.esperado = hash(config.get('CRON_SECRET', { infer: true }));
  }

  canActivate(context: ExecutionContext): boolean {
    const recibido = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined> }>().headers[
      CABECERA_CRON
    ];
    if (!recibido || !timingSafeEqual(hash(recibido), this.esperado)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

function hash(valor: string): Buffer {
  return createHash('sha256').update(valor).digest();
}
