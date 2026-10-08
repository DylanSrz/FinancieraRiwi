import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

/** Política de contraseñas (RN-20): mínimo 8 caracteres, una mayúscula y un número. */
export const POLITICA_CONTRASENA = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

/** Usado para activar una invitación (HU-01) y para restablecer la contraseña (HU-04). */
export class DefinirContrasenaDto {
  @ApiProperty({ description: 'Token de un solo uso recibido por correo' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NuevaClave2026' })
  @IsString()
  @MinLength(8)
  @Matches(POLITICA_CONTRASENA, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  })
  password: string;
}
