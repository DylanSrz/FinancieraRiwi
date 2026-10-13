import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { Public } from '../common/decorators/public.decorator.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import type { Env } from '../config/env.validation.js';
import { AuthService } from './auth.service.js';
import type {
  MetaSesion,
  ParDeTokens,
  UsuarioAutenticado,
} from './auth.types.js';
import { DefinirContrasenaDto } from './dto/definir-contrasena.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto.js';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';
import type { PerfilGoogle } from './strategies/google.strategy.js';
import { COOKIE_REFRESH } from './tokens.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión con correo y contraseña (HU-02)' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.login(dto.email, dto.password, meta(req));
    return this.responderConSesion(res, tokens);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Redirige al consentimiento de Google (HU-03)' })
  google() {
    // Passport redirige a Google; este cuerpo no se ejecuta.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary:
      'Callback de Google: crea la sesión y redirige al frontend (HU-03)',
  })
  async googleCallback(
    @Req() req: Request & { user?: PerfilGoogle },
    @Res() res: Response,
  ) {
    const frontend = this.config.get('FRONTEND_URL', { infer: true });
    if (!req.user) return res.redirect(`${frontend}/login?error=google`);
    try {
      const tokens = await this.auth.loginConGoogle(req.user, meta(req));
      res.cookie(
        COOKIE_REFRESH,
        tokens.refreshToken,
        this.opcionesCookie(tokens.refreshExpiraEn),
      );
      return res.redirect(`${frontend}/`);
    } catch {
      return res.redirect(`${frontend}/login?error=sin-acceso`);
    }
  }

  @Public()
  @Post('activar')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Activar cuenta invitada definiendo la contraseña (HU-01)',
  })
  activar(@Body() dto: DefinirContrasenaDto) {
    return this.auth.activarCuenta(dto.token, dto.password);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiCookieAuth(COOKIE_REFRESH)
  @ApiOperation({
    summary:
      'Renovar el access token con el refresh token de la cookie (HU-05)',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tokens = await this.auth.refrescar(cookieRefresh(req), meta(req));
      return this.responderConSesion(res, tokens);
    } catch (error) {
      res.clearCookie(COOKIE_REFRESH, this.opcionesCookie());
      throw error;
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Cerrar sesión y revocar el refresh token (HU-05)' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(cookieRefresh(req));
    res.clearCookie(COOKIE_REFRESH, this.opcionesCookie());
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('recuperar')
  @HttpCode(202)
  @ApiOperation({
    summary: 'Solicitar enlace de recuperación de contraseña (HU-04)',
  })
  recuperar(@Body() dto: SolicitarRecuperacionDto) {
    return this.auth.solicitarRecuperacion(dto.email);
  }

  @Public()
  @Post('restablecer')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Definir nueva contraseña con el token recibido (HU-04)',
  })
  restablecer(@Body() dto: DefinirContrasenaDto) {
    return this.auth.restablecerContrasena(dto.token, dto.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  me(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.auth.perfil(usuario.sub);
  }

  private responderConSesion(res: Response, tokens: ParDeTokens) {
    res.cookie(
      COOKIE_REFRESH,
      tokens.refreshToken,
      this.opcionesCookie(tokens.refreshExpiraEn),
    );
    return { accessToken: tokens.accessToken };
  }

  /** Cookie first-party gracias al rewrite de Vercel (ADR-004, ADR-008). */
  private opcionesCookie(expira?: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('NODE_ENV', { infer: true }) === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      ...(expira ? { expires: expira } : {}),
    };
  }
}

function cookieRefresh(req: Request): string | undefined {
  return (req.cookies as Record<string, string> | undefined)?.[COOKIE_REFRESH];
}

function meta(req: Request): MetaSesion {
  return { ip: req.ip, userAgent: req.headers['user-agent'] };
}
