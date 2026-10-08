import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { pendiente } from '../common/pendiente.js';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('periodos/:id')
export class ReportesController {
  @Get('resumen')
  @ApiOperation({
    summary:
      'Totales del periodo: devengado, deducciones, neto y costo empleador (HU-23)',
  })
  resumen(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-23');
  }

  @Get('exportar')
  @ApiQuery({ name: 'formato', enum: ['csv', 'pdf'] })
  @ApiOperation({ summary: 'Exportar la nómina del periodo (HU-24)' })
  exportar(
    @Param('id', ParseUUIDPipe) _id: string,
    @Query('formato') _formato: 'csv' | 'pdf',
  ) {
    pendiente('HU-24');
  }

  @Post('desprendibles')
  @ApiOperation({
    summary: 'Enviar desprendibles por correo a los colaboradores (HU-25)',
  })
  enviarDesprendibles(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-25');
  }
}
