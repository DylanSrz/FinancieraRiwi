import { Module } from '@nestjs/common';
import { HorasController } from './horas.controller.js';

@Module({
  controllers: [HorasController],
})
export class HorasModule {}
