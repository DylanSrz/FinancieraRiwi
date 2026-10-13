import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { pendiente } from '../common/pendiente.js';
import type { Env } from '../config/env.validation.js';
import type { Usuario } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { JwtPayload, MetaSesion, ParDeTokens } from './auth.types.js';
import type { PerfilGoogle } from './strategies/google.strategy.js';
import {
  generarToken,
  hashToken,
  MAX_INTENTOS_FALLIDOS,
  MINUTOS_BLOQUEO,
} from './tokens.js';

const CREDENCIALES_INVALIDAS = 'Correo o contraseña incorrectos';
const SESION_INVALIDA = 'La sesión expiró, inicia sesión de nuevo';
const ENLACE_INVALIDO = 'El enlace no es válido o ha expirado';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  /** HU-02: valida credenciales, controla intentos fallidos y emite tokens. */
  async login(
    email: string,
    password: string,
    meta: MetaSesion = {},
  ): Promise<ParDeTokens> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!usuario || usuario.estado !== 'ACTIVO' || !usuario.passwordHash) {
      throw new UnauthorizedException(CREDENCIALES_INVALIDAS);
    }
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
      throw new UnauthorizedException(
        `Cuenta bloqueada temporalmente por intentos fallidos. Intenta de nuevo en ${MINUTOS_BLOQUEO} minutos.`,
      );
    }

    if (!(await bcrypt.compare(password, usuario.passwordHash))) {
      const intentos = usuario.intentosFallidos + 1;
      const bloquear = intentos >= MAX_INTENTOS_FALLIDOS;
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          intentosFallidos: bloquear ? 0 : intentos,
          bloqueadoHasta: bloquear
            ? new Date(Date.now() + MINUTOS_BLOQUEO * 60_000)
            : null,
        },
      });
      throw new UnauthorizedException(CREDENCIALES_INVALIDAS);
    }

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        intentosFallidos: 0,
        bloqueadoHasta: null,
        ultimoAcceso: new Date(),
      },
    });
    return this.emitirTokens(usuario, randomUUID(), meta);
  }

  /** HU-03: solo correos previamente invitados; activa la cuenta si estaba PENDIENTE. */
  async loginConGoogle(
    perfil: PerfilGoogle,
    meta: MetaSesion = {},
  ): Promise<ParDeTokens> {
    const usuario = perfil.email
      ? await this.prisma.usuario.findUnique({ where: { email: perfil.email } })
      : null;
    if (!usuario || usuario.estado === 'INACTIVO' || !perfil.emailVerificado) {
      throw new ForbiddenException('Tu cuenta no tiene acceso a la plataforma');
    }
    if (usuario.googleId && usuario.googleId !== perfil.googleId) {
      throw new ForbiddenException('Tu cuenta no tiene acceso a la plataforma');
    }
    const actualizado = await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        googleId: perfil.googleId,
        estado: 'ACTIVO',
        emailVerificado: true,
        ultimoAcceso: new Date(),
        nombre: usuario.nombre || perfil.nombre,
      },
    });
    return this.emitirTokens(actualizado, randomUUID(), meta);
  }

  /** HU-01: consume el token de invitación y define la contraseña. */
  async activarCuenta(token: string, password: string): Promise<void> {
    const registro = await this.prisma.tokenAccion.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { usuario: true },
    });
    if (
      !registro ||
      registro.tipo !== 'INVITACION' ||
      registro.usadoEn ||
      registro.expiraEn < new Date() ||
      registro.usuario.estado === 'INACTIVO'
    ) {
      throw new UnauthorizedException(ENLACE_INVALIDO);
    }
    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: registro.usuarioId },
        data: {
          passwordHash: await bcrypt.hash(password, 12),
          estado: 'ACTIVO',
          emailVerificado: true,
        },
      }),
      this.prisma.tokenAccion.update({
        where: { id: registro.id },
        data: { usadoEn: new Date() },
      }),
    ]);
  }

  /** HU-05: rota el refresh token; si se reutiliza uno revocado, revoca la familia completa. */
  async refrescar(
    refreshToken: string | undefined,
    meta: MetaSesion = {},
  ): Promise<ParDeTokens> {
    if (!refreshToken) throw new UnauthorizedException(SESION_INVALIDA);
    const registro = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
      include: { usuario: true },
    });
    if (!registro) throw new UnauthorizedException(SESION_INVALIDA);

    if (registro.revocadoEn) {
      // Reutilización de un token ya rotado: posible robo → se cierra toda la cadena.
      await this.prisma.refreshToken.updateMany({
        where: { familia: registro.familia, revocadoEn: null },
        data: { revocadoEn: new Date() },
      });
      throw new UnauthorizedException(SESION_INVALIDA);
    }
    if (
      registro.expiraEn < new Date() ||
      registro.usuario.estado !== 'ACTIVO'
    ) {
      throw new UnauthorizedException(SESION_INVALIDA);
    }

    await this.prisma.refreshToken.update({
      where: { id: registro.id },
      data: { revocadoEn: new Date() },
    });
    return this.emitirTokens(registro.usuario, registro.familia, meta);
  }

  /** HU-05: revoca el refresh token actual. */
  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revocadoEn: null },
      data: { revocadoEn: new Date() },
    });
  }

  /** Revoca todas las sesiones activas de un usuario (desactivación, cambio de contraseña). */
  async revocarSesiones(usuarioId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revocadoEn: null },
      data: { revocadoEn: new Date() },
    });
  }

  async perfil(usuarioId: string) {
    const u = await this.prisma.usuario.findUniqueOrThrow({
      where: { id: usuarioId },
    });
    return {
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      empresaId: u.empresaId,
    };
  }

  /** HU-04 (Sprint 2): envía el enlace de recuperación. */
  solicitarRecuperacion(_email: string): Promise<void> {
    pendiente('HU-04');
  }

  /** HU-04 (Sprint 2): define la nueva contraseña y revoca todas las sesiones. */
  restablecerContrasena(_token: string, _password: string): Promise<void> {
    pendiente('HU-04');
  }

  private async emitirTokens(
    usuario: Usuario,
    familia: string,
    meta: MetaSesion,
  ): Promise<ParDeTokens> {
    const payload: JwtPayload = {
      sub: usuario.id,
      empresaId: usuario.empresaId,
      email: usuario.email,
      rol: usuario.rol,
    };
    const refreshToken = generarToken();
    const refreshExpiraEn = new Date(
      Date.now() +
        this.config.get('REFRESH_TOKEN_DIAS', { infer: true }) * 86_400_000,
    );
    await this.prisma.refreshToken.create({
      data: {
        usuarioId: usuario.id,
        tokenHash: hashToken(refreshToken),
        familia,
        expiraEn: refreshExpiraEn,
        ip: meta.ip,
        userAgent: meta.userAgent?.slice(0, 255),
      },
    });
    return {
      accessToken: await this.jwt.signAsync(payload),
      refreshToken,
      refreshExpiraEn,
    };
  }
}
