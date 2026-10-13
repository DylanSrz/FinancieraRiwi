import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { RolColaborador } from '../../generated/prisma/enums.js';

export class SimularLiquidacionDto {
  @ApiProperty({ enum: RolColaborador, example: 'OPERARIO' })
  @IsEnum(RolColaborador)
  rol: RolColaborador;

  @ApiProperty({ example: 168 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(744)
  horas: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  hijos: number;

  @ApiPropertyOptional({ example: 1, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  claseRiesgoArl?: number;

  @ApiPropertyOptional({
    example: '2026-10-30',
    description: 'Fecha de corte (por defecto, hoy)',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  fechaCorte?: string;
}
