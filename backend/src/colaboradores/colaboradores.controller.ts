import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { pendiente } from '../common/pendiente.js';
import {
  ActualizarColaboradorDto,
  CrearColaboradorDto,
} from './dto/colaborador.dto.js';

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('colaboradores')
export class ColaboradoresController {
  @Get()
  @ApiOperation({ summary: 'Listar y buscar colaboradores, paginado (HU-10)' })
  listar(
    @Query('q') _q?: string,
    @Query('rol') _rol?: string,
    @Query('pagina') _pagina?: string,
  ) {
    pendiente('HU-10');
  }

  @Post()
  @ApiOperation({ summary: 'Crear colaborador (HU-09)' })
  crear(@Body() _dto: CrearColaboradorDto) {
    pendiente('HU-09');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar colaborador (HU-09)' })
  actualizar(
    @Param('id', ParseUUIDPipe) _id: string,
    @Body() _dto: ActualizarColaboradorDto,
  ) {
    pendiente('HU-09');
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar colaborador; no se elimina el histórico (HU-09)',
  })
  desactivar(@Param('id', ParseUUIDPipe) _id: string) {
    pendiente('HU-09');
  }

  @Post('importaciones/previsualizar')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Validar CSV y devolver filas válidas/ inválidas (HU-07, HU-08)',
  })
  previsualizar() {
    pendiente('HU-07/HU-08');
  }

  @Post('importaciones')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Confirmar importación del CSV en una transacción (HU-07)',
  })
  importar() {
    pendiente('HU-07');
  }
}
