import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'aux@financierariwi.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Contrasena123' })
  @IsString()
  @MinLength(8)
  password: string;
}
