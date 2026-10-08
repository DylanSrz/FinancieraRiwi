import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { pendiente } from '../common/pendiente.js';

@ApiTags('Parámetros')
@ApiBearerAuth()
@Controller('parametros')
export class ParametrosController {
  @Get('legales/:anio')
  @ApiOperation({ summary: 'Parámetros legales de un año (HU-21)' })
  obtenerLegales(@Param('anio', ParseIntPipe) _anio: number) {
    pendiente('HU-21');
  }

  @Put('legales/:anio')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Crear o actualizar parámetros legales de un año (HU-21)',
  })
  guardarLegales(@Param('anio', ParseIntPipe) _anio: number) {
    pendiente('HU-21');
  }

  @Get('valores-hora')
  @ApiOperation({
    summary: 'Valores hora vigentes e histórico por rol (HU-22)',
  })
  valoresHora() {
    pendiente('HU-22');
  }

  @Post('valores-hora')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Registrar nuevo valor hora con fecha de vigencia (HU-22)',
  })
  nuevoValorHora() {
    pendiente('HU-22');
  }
}
