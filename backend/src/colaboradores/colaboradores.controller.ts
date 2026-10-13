import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { UsuarioAutenticado } from '../auth/auth.types.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import { ColaboradoresService } from './colaboradores.service.js';
import {
  ActualizarColaboradorDto,
  CrearColaboradorDto,
  FiltroColaboradoresDto,
} from './dto/colaborador.dto.js';
import {
  ArchivoCsvInvalidoError,
  TAMANO_MAXIMO_CSV,
} from './importacion-csv.js';

/** Archivo recibido por multer (memoria). */
interface ArchivoSubido {
  originalname: string;
  buffer: Buffer;
}

const SUBIDA_CSV = FileInterceptor('archivo', {
  limits: { fileSize: TAMANO_MAXIMO_CSV },
});
const CUERPO_CSV = {
  schema: {
    type: 'object',
    properties: { archivo: { type: 'string', format: 'binary' } },
  },
};

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('colaboradores')
export class ColaboradoresController {
  constructor(private readonly colaboradores: ColaboradoresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar y buscar colaboradores, paginado (HU-10)' })
  listar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Query() filtro: FiltroColaboradoresDto,
  ) {
    return this.colaboradores.listar(u.empresaId, filtro);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un colaborador' })
  obtener(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.colaboradores.obtener(u.empresaId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear colaborador (HU-09)' })
  crear(
    @UsuarioActual() u: UsuarioAutenticado,
    @Body() dto: CrearColaboradorDto,
  ) {
    return this.colaboradores.crear(u.empresaId, dto, u.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar o reactivar colaborador (HU-09)' })
  actualizar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarColaboradorDto,
  ) {
    return this.colaboradores.actualizar(u.empresaId, id, dto, u.sub);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar colaborador; no se elimina el histórico (HU-09)',
  })
  desactivar(
    @UsuarioActual() u: UsuarioAutenticado,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.colaboradores.desactivar(u.empresaId, id, u.sub);
  }

  @Post('importaciones/previsualizar')
  @UseInterceptors(SUBIDA_CSV)
  @ApiConsumes('multipart/form-data')
  @ApiBody(CUERPO_CSV)
  @ApiOperation({
    summary: 'Validar CSV y devolver filas válidas e inválidas (HU-07, HU-08)',
  })
  previsualizar(
    @UsuarioActual() u: UsuarioAutenticado,
    @UploadedFile() archivo?: ArchivoSubido,
  ) {
    return conCsv(archivo, (contenido) =>
      this.colaboradores.previsualizar(u.empresaId, contenido),
    );
  }

  @Post('importaciones')
  @UseInterceptors(SUBIDA_CSV)
  @ApiConsumes('multipart/form-data')
  @ApiBody(CUERPO_CSV)
  @ApiOperation({
    summary: 'Confirmar importación del CSV en una transacción (HU-07)',
  })
  importar(
    @UsuarioActual() u: UsuarioAutenticado,
    @UploadedFile() archivo?: ArchivoSubido,
  ) {
    return conCsv(archivo, (contenido) =>
      this.colaboradores.importar(u.empresaId, contenido, u.sub),
    );
  }
}

async function conCsv<T>(
  archivo: ArchivoSubido | undefined,
  accion: (c: Buffer) => Promise<T>,
) {
  if (!archivo)
    throw new BadRequestException(
      'Adjunta un archivo CSV en el campo "archivo"',
    );
  if (!archivo.originalname.toLowerCase().endsWith('.csv')) {
    throw new BadRequestException('El archivo debe tener extensión .csv');
  }
  try {
    return await accion(archivo.buffer);
  } catch (e) {
    if (e instanceof ArchivoCsvInvalidoError)
      throw new BadRequestException(e.message);
    throw e;
  }
}
