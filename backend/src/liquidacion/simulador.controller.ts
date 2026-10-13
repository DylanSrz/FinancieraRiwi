import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UsuarioAutenticado } from '../auth/auth.types.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import { ParametrosService } from '../parametros/parametros.service.js';
import { calcularLiquidacion } from './domain/calculadora-nomina.js';
import { SimularLiquidacionDto } from './dto/simular.dto.js';

/** Calcula una liquidación sin guardarla, con los parámetros vigentes (HU-12 a HU-16). */
@ApiTags('Liquidación')
@ApiBearerAuth()
@Controller('liquidaciones/simular')
export class SimuladorController {
  constructor(private readonly parametros: ParametrosService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Simular la liquidación de un colaborador (no guarda nada)',
  })
  async simular(
    @UsuarioActual() u: UsuarioAutenticado,
    @Body() dto: SimularLiquidacionDto,
  ) {
    const fechaCorte = dto.fechaCorte ? new Date(dto.fechaCorte) : new Date();
    const parametros = await this.parametros.paraLiquidar(
      u.empresaId,
      fechaCorte,
    );
    const resultado = calcularLiquidacion(
      {
        rol: dto.rol,
        horas: dto.horas,
        hijos: dto.hijos,
        claseRiesgoArl: dto.claseRiesgoArl ?? 1,
      },
      parametros,
    );
    return {
      entrada: { ...dto, fechaCorte: fechaCorte.toISOString().slice(0, 10) },
      resultado,
    };
  }
}
