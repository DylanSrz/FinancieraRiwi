import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { RolColaborador } from '../../generated/prisma/enums.js';

const recortar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Mismas validaciones que una fila del CSV (RN-19). */
export class CrearColaboradorDto {
  @ApiProperty({ example: 'Ana María' })
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Pérez Gómez' })
  @Transform(recortar)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellidos: string;

  @ApiProperty({ example: 'ana.perez@financierariwi.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @ApiProperty({ enum: RolColaborador })
  @IsEnum(RolColaborador)
  rol: RolColaborador;

  @ApiProperty({ minimum: 18, maximum: 100, example: 29 })
  @IsInt()
  @Min(18)
  @Max(100)
  edad: number;

  @ApiProperty({ minimum: 0, example: 2 })
  @IsInt()
  @Min(0)
  hijos: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  claseRiesgoArl?: number;
}

export class ActualizarColaboradorDto extends PartialType(CrearColaboradorDto) {
  @ApiPropertyOptional({ description: 'false = desactivado (no se liquida)' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

/** HU-10: filtros del listado. */
export class FiltroColaboradoresDto {
  @ApiPropertyOptional({ description: 'Busca en nombres, apellidos o email' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: RolColaborador })
  @IsOptional()
  @IsEnum(RolColaborador)
  rol?: RolColaborador;

  @ApiPropertyOptional({
    enum: ['activos', 'inactivos', 'todos'],
    default: 'activos',
  })
  @IsOptional()
  @IsIn(['activos', 'inactivos', 'todos'])
  estado?: 'activos' | 'inactivos' | 'todos';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  porPagina?: number;
}
