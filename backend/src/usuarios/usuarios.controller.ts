import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { pendiente } from '../common/pendiente.js';
import { InvitarUsuarioDto } from './dto/invitar-usuario.dto.js';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('usuarios')
export class UsuariosController {
  @Get()
  @ApiOperation({ summary: 'Listar usuarios (HU-06)' })
  listar() {
    pendiente('HU-06');
  }

  @Post('invitaciones')
  @ApiOperation({
    summary: 'Invitar usuario y enviar correo de activación (HU-01)',
  })
  invitar(@Body() _dto: InvitarUsuarioDto) {
    pendiente('HU-01');
  }

  @Post(':id/reenviar-invitacion')
  @ApiOperation({ summary: 'Reenviar invitación vencida (HU-01)' })
  reenviar(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-01');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar rol o desactivar un usuario (HU-06)' })
  actualizar(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-06');
  }
}
