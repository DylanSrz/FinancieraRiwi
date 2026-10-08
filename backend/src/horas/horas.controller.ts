import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { pendiente } from '../common/pendiente.js';

@ApiTags('Horas')
@ApiBearerAuth()
@Controller('periodos/:periodoId/horas')
export class HorasController {
  @Get()
  @ApiOperation({ summary: 'Horas registradas en el periodo (HU-11)' })
  listar(@Param('periodoId', ParseUUIDPipe) _periodoId: string) {
    pendiente('HU-11');
  }

  @Put(':colaboradorId')
  @ApiOperation({
    summary: 'Registrar o actualizar horas de un colaborador (HU-11)',
  })
  registrar(
    @Param('periodoId', ParseUUIDPipe) _periodoId: string,
    @Param('colaboradorId', ParseUUIDPipe) _colaboradorId: string,
  ) {
    pendiente('HU-11');
  }

  @Post('importaciones')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Importar horas desde CSV email,horas (HU-11)' })
  importar(@Param('periodoId', ParseUUIDPipe) _periodoId: string) {
    pendiente('HU-11');
  }
}
