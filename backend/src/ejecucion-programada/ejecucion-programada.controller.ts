import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { pendiente } from '../common/pendiente.js';
import { CronSecretGuard } from './guards/cron-secret.guard.js';

/**
 * Endpoint invocado a diario por Supabase pg_cron + pg_net a las 00:00 UTC (7:00 p. m. Bogotá).
 * Decide si hoy corresponde liquidar (RN-08) y ejecuta de forma idempotente (RN-17). Ver ADR-007.
 */
@ApiExcludeController()
@Public()
@UseGuards(CronSecretGuard)
@Controller('liquidaciones')
export class EjecucionProgramadaController {
  @Post('ejecucion-programada')
  @HttpCode(202)
  ejecutar() {
    pendiente('HU-17');
  }
}
