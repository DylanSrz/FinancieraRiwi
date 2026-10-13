import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

const PORCENTAJE = {
  minimum: 0,
  maximum: 1,
  description: 'Fracción decimal: 0.04 = 4 %',
};

export class TramoFspDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(0)
  desdeSmmlv: number;

  @ApiProperty({
    example: 16,
    nullable: true,
    description: 'null = sin límite superior',
  })
  @IsOptional()
  @IsNumber()
  hastaSmmlv: number | null;

  @ApiProperty({ example: 0.01, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  tasa: number;
}

/** HU-21: parámetros legales de un año. */
export class ParametrosLegalesDto {
  @ApiProperty({ example: 1_750_905 })
  @IsPositive()
  smmlv: number;

  @ApiProperty({ example: 249_095 })
  @IsNumber()
  @Min(0)
  auxilioTransporte: number;

  @ApiProperty({ example: 2 })
  @IsPositive()
  topeAuxilioSmmlv: number;

  @ApiProperty({ example: 0.04, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  saludEmpleado: number;

  @ApiProperty({ example: 0.04, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  pensionEmpleado: number;

  @ApiProperty({ example: 0.085, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  saludEmpleador: number;

  @ApiProperty({ example: 0.12, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  pensionEmpleador: number;

  @ApiProperty({ example: 0.04, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  cajaCompensacion: number;

  @ApiProperty({ example: 0.03, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  icbf: number;

  @ApiProperty({ example: 0.02, ...PORCENTAJE })
  @IsNumber()
  @Min(0)
  @Max(1)
  sena: number;

  @ApiProperty({ example: 10 })
  @IsPositive()
  topeExoneracionSmmlv: number;

  @ApiProperty({
    example: 180,
    description: 'Máximo de horas ordinarias al mes (RN-15)',
  })
  @IsPositive()
  @Max(744)
  horasMaxMes: number;

  @ApiProperty({ type: [TramoFspDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TramoFspDto)
  fspTramos: TramoFspDto[];

  @ApiProperty({
    example: {
      '1': 0.00522,
      '2': 0.01044,
      '3': 0.02436,
      '4': 0.0435,
      '5': 0.0696,
    },
  })
  @IsObject()
  arlTarifas: Record<string, number>;
}
