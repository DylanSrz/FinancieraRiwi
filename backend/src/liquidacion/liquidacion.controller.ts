import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { pendiente } from '../common/pendiente.js';

@ApiTags('Liquidación')
@ApiBearerAuth()
@Controller('periodos')
export class LiquidacionController {
  @Get()
  @ApiOperation({ summary: 'Listar periodos con su estado' })
  listarPeriodos() {
    pendiente('HU-18');
  }

  @Post(':id/liquidar')
  @ApiOperation({
    summary:
      'Liquidar manualmente o reliquidar un periodo abierto/calculado (HU-18)',
  })
  liquidar(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-18');
  }

  @Post(':id/cerrar')
  @ApiOperation({
    summary: 'Cerrar (aprobar) el periodo; queda inmutable (HU-19)',
  })
  cerrar(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-19');
  }

  @Get(':id/liquidaciones')
  @ApiOperation({ summary: 'Detalle de liquidaciones del periodo (HU-23)' })
  liquidaciones(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-23');
  }

  @Get(':id/ejecuciones')
  @ApiOperation({ summary: 'Historial de ejecuciones del periodo (HU-20)' })
  ejecuciones(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-20');
  }
}
