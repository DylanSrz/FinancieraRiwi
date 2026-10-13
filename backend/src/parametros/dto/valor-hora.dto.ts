import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsPositive } from 'class-validator';
import { RolColaborador } from '../../generated/prisma/enums.js';

/** HU-22: nuevo valor hora con fecha de vigencia. */
export class NuevoValorHoraDto {
  @ApiProperty({ enum: RolColaborador })
  @IsEnum(RolColaborador)
  rol: RolColaborador;

  @ApiProperty({ example: 22_000 })
  @IsPositive()
  valorHora: number;

  @ApiProperty({ example: '2026-11-01' })
  @IsDateString({ strict: true })
  vigenteDesde: string;
}
