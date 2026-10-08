import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator.js';
import { pendiente } from '../common/pendiente.js';

@ApiTags('Auditoría')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('auditoria')
export class AuditoriaController {
  @Get()
  @ApiOperation({
    summary:
      'Consultar auditoría filtrando por fecha, usuario o entidad (HU-20)',
  })
  listar() {
    pendiente('HU-20');
  }
}
