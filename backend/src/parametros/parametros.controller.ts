import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UsuarioAutenticado } from '../auth/auth.types.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import { ParametrosLegalesDto } from './dto/parametros-legales.dto.js';
import { NuevoValorHoraDto } from './dto/valor-hora.dto.js';
import { ParametrosService } from './parametros.service.js';

const ANIO = new ParseIntPipe({ errorHttpStatusCode: 400 });

@ApiTags('Parámetros')
@ApiBearerAuth()
@Controller('parametros')
export class ParametrosController {
  constructor(private readonly parametros: ParametrosService) {}

  @Get('legales')
  @ApiOperation({ summary: 'Años con parámetros legales configurados (HU-21)' })
  anios(@UsuarioActual() u: UsuarioAutenticado) {
    return this.parametros.aniosConfigurados(u.empresaId);
  }

  @Get('legales/:anio')
  @ApiOperation({ summary: 'Parámetros legales de un año (HU-21)' })
  obtenerLegales(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('anio', ANIO) anio: number,
  ) {
    return this.parametros.obtenerLegales(u.empresaId, anio);
  }

  @Put('legales/:anio')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Crear o actualizar parámetros legales de un año (HU-21)',
  })
  guardarLegales(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('anio', ANIO) anio: number,
    @Body() dto: ParametrosLegalesDto,
  ) {
    return this.parametros.guardarLegales(u.empresaId, anio, dto, u.sub);
  }

  @Get('valores-hora')
  @ApiOperation({
    summary: 'Valores hora vigentes e histórico por rol (HU-22)',
  })
  valoresHora(@UsuarioActual() u: UsuarioAutenticado) {
    return this.parametros.valoresHora(u.empresaId);
  }

  @Post('valores-hora')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Registrar nuevo valor hora con fecha de vigencia (HU-22)',
  })
  nuevoValorHora(
    @UsuarioActual() u: UsuarioAutenticado,
    @Body() dto: NuevoValorHoraDto,
  ) {
    return this.parametros.nuevoValorHora(u.empresaId, dto, u.sub);
  }

  @Get('bonificaciones-hijos')
  @ApiOperation({
    summary: 'Bonificación por número de hijos vigente (RN-04..06)',
  })
  bonificaciones(@UsuarioActual() u: UsuarioAutenticado) {
    return this.parametros.bonificaciones(u.empresaId);
  }
}
