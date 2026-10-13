import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Env } from '../../config/env.validation.js';

/**
 * Login con Google (HU-03). Si Google no está configurado responde 503.
 * Si el usuario cancela o Google falla, no lanza error: el controlador redirige al login con ?error=google.
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService<Env, true>) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (!this.config.get('GOOGLE_CLIENT_ID', { infer: true })) {
      throw new ServiceUnavailableException(
        'El inicio de sesión con Google no está configurado',
      );
    }
    return super.canActivate(context);
  }

  handleRequest<T>(_err: unknown, user: T): T {
    return user;
  }
}
