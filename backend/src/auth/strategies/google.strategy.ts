import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import type { Env } from '../../config/env.validation.js';

export interface PerfilGoogle {
  googleId: string;
  email: string;
  nombre: string;
  emailVerificado: boolean;
}

/**
 * Login con Google (HU-03). Solo se aceptan correos previamente invitados;
 * esa validación ocurre en AuthService.loginConGoogle.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService<Env, true>) {
    super({
      clientID:
        config.get('GOOGLE_CLIENT_ID', { infer: true }) ?? 'no-configurado',
      clientSecret:
        config.get('GOOGLE_CLIENT_SECRET', { infer: true }) ?? 'no-configurado',
      callbackURL:
        config.get('GOOGLE_CALLBACK_URL', { infer: true }) ??
        'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): PerfilGoogle {
    const email = profile.emails?.[0];
    return {
      googleId: profile.id,
      email: email?.value.toLowerCase() ?? '',
      nombre: profile.displayName,
      emailVerificado: Boolean(email?.verified),
    };
  }
}
