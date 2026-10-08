import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../../generated/prisma/enums.js';

export class InvitarUsuarioDto {
  @ApiProperty({ example: 'Laura Gómez' })
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'laura.gomez@financierariwi.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: RolUsuario })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
