import { Module } from '@nestjs/common';
import { ParametrosModule } from '../parametros/parametros.module.js';
import { LiquidacionController } from './liquidacion.controller.js';
import { SimuladorController } from './simulador.controller.js';

@Module({
  imports: [ParametrosModule],
  controllers: [LiquidacionController, SimuladorController],
})
export class LiquidacionModule {}
