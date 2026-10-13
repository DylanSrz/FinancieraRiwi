import { Module } from '@nestjs/common';
import { ColaboradoresController } from './colaboradores.controller.js';
import { ColaboradoresService } from './colaboradores.service.js';

@Module({
  controllers: [ColaboradoresController],
  providers: [ColaboradoresService],
  exports: [ColaboradoresService],
})
export class ColaboradoresModule {}
