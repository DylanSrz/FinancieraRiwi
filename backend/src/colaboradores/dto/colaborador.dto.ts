import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { RolColaborador } from '../../generated/prisma/enums.js';

/** Mismas validaciones que una fila del CSV (RN-19). */
export class CrearColaboradorDto {
  @ApiProperty({ example: 'Ana María' })
  @IsString()
  @MinLength(2)
  nombres: string;

  @ApiProperty({ example: 'Pérez Gómez' })
  @IsString()
  @MinLength(2)
  apellidos: string;

  @ApiProperty({ example: 'ana.perez@financierariwi.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: RolColaborador })
  @IsEnum(RolColaborador)
  rol: RolColaborador;

  @ApiProperty({ minimum: 18, example: 29 })
  @IsInt()
  @Min(18)
  @Max(100)
  edad: number;

  @ApiProperty({ minimum: 0, example: 2 })
  @IsInt()
  @Min(0)
  hijos: number;
}

export class ActualizarColaboradorDto extends PartialType(
  CrearColaboradorDto,
) {}
