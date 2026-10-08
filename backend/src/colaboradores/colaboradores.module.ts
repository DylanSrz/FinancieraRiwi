import { Module } from '@nestjs/common';
import { ColaboradoresController } from './colaboradores.controller.js';

@Module({
  controllers: [ColaboradoresController],
})
export class ColaboradoresModule {}
