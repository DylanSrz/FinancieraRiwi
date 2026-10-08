import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import { pendiente } from '../common/pendiente.js';
import { AuthService } from './auth.service.js';
import type { UsuarioAutenticado } from './auth.types.js';
import { DefinirContrasenaDto } from './dto/definir-contrasena.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto.js';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión con correo y contraseña (HU-02)' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
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
    summary: 'Callback de Google: emite tokens y redirige al frontend (HU-03)',
  })
  googleCallback() {
    pendiente('HU-03');
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
  @ApiOperation({
    summary:
      'Renovar el access token con el refresh token de la cookie (HU-05)',
  })
  refresh() {
    pendiente('HU-05');
  }

  @Post('logout')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión y revocar el refresh token (HU-05)' })
  logout() {
    pendiente('HU-05');
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
  @ApiOperation({ summary: 'Usuario autenticado' })
  me(@UsuarioActual() usuario: UsuarioAutenticado) {
    return usuario;
  }
}
