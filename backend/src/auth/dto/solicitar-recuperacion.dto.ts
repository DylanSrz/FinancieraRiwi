import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SolicitarRecuperacionDto {
  @ApiProperty({ example: 'aux@financierariwi.com' })
  @IsEmail()
  email: string;
}
