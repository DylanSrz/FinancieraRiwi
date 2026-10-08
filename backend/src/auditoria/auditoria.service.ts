import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface EventoAuditoria {
  empresaId: string;
  usuarioId?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  antes?: Prisma.InputJsonValue;
  despues?: Prisma.InputJsonValue;
  ip?: string;
}

/** Registro de auditoría (RNF-07). Los módulos lo llaman en cada acción relevante. */
@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(evento: EventoAuditoria): Promise<void> {
    await this.prisma.auditoria.create({ data: evento });
  }
}
