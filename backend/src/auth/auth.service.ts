import { Injectable } from '@nestjs/common';
import { pendiente } from '../common/pendiente.js';
import type { ParDeTokens } from './auth.types.js';
import type { PerfilGoogle } from './strategies/google.strategy.js';

@Injectable()
export class AuthService {
  /** HU-02: valida credenciales, controla intentos fallidos y emite tokens. */
  login(_email: string, _password: string): Promise<ParDeTokens> {
    pendiente('HU-02');
  }

  /** HU-03: solo correos invitados; activa la cuenta si estaba PENDIENTE. */
  loginConGoogle(_perfil: PerfilGoogle): Promise<ParDeTokens> {
    pendiente('HU-03');
  }

  /** HU-01: consume el token de invitación y define la contraseña. */
  activarCuenta(_token: string, _password: string): Promise<void> {
    pendiente('HU-01');
  }

  /** HU-05: rota el refresh token; si se reutiliza uno revocado, revoca la familia completa. */
  refrescar(_refreshToken: string): Promise<ParDeTokens> {
    pendiente('HU-05');
  }

  /** HU-05: revoca el refresh token actual. */
  logout(_refreshToken: string): Promise<void> {
    pendiente('HU-05');
  }

  /** HU-04: envía el enlace de recuperación (respuesta idéntica exista o no el correo). */
  solicitarRecuperacion(_email: string): Promise<void> {
    pendiente('HU-04');
  }

  /** HU-04: define la nueva contraseña y revoca todas las sesiones. */
  restablecerContrasena(_token: string, _password: string): Promise<void> {
    pendiente('HU-04');
  }
}
