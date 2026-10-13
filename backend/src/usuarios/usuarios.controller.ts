import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UsuarioAutenticado } from '../auth/auth.types.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import { InvitarUsuarioDto } from './dto/invitar-usuario.dto.js';
import { UsuariosService } from './usuarios.service.js';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios (HU-06)' })
  listar(@UsuarioActual() u: UsuarioAutenticado) {
    return this.usuarios.listar(u.empresaId);
  }

  @Post('invitaciones')
  @ApiOperation({
    summary: 'Invitar usuario y enviar correo de activación (HU-01)',
  })
  invitar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Body() dto: InvitarUsuarioDto,
  ) {
    return this.usuarios.invitar(u.empresaId, dto, u.sub);
  }

  @Post(':id/reenviar-invitacion')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Reenviar invitación a un usuario pendiente (HU-01)',
  })
  reenviar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usuarios.reenviarInvitacion(u.empresaId, id, u.sub);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cambiar rol o activar/desactivar un usuario (HU-06)',
  })
  actualizar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarUsuarioDto,
  ) {
    return this.usuarios.actualizar(u.empresaId, id, dto, u.sub);
  }
}
