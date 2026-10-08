import { Module } from '@nestjs/common';
import { EjecucionProgramadaController } from './ejecucion-programada.controller.js';

@Module({
  controllers: [EjecucionProgramadaController],
})
export class EjecucionProgramadaModule {}
