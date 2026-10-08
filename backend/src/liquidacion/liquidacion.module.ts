import { Module } from '@nestjs/common';
import { LiquidacionController } from './liquidacion.controller.js';

@Module({
  controllers: [LiquidacionController],
})
export class LiquidacionModule {}
