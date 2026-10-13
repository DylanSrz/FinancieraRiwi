import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AuthService } from '../auth/auth.service.js';
import { generarToken, hashToken, HORAS_INVITACION } from '../auth/tokens.js';
import type { Env } from '../config/env.validation.js';
import type { Usuario } from '../generated/prisma/client.js';
import { MailService } from '../mail/mail.service.js';
import { correoInvitacion } from '../mail/plantillas.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import type { InvitarUsuarioDto } from './dto/invitar-usuario.dto.js';

export type UsuarioVista = Pick<
  Usuario,
  'id' | 'nombre' | 'email' | 'rol' | 'estado' | 'ultimoAcceso' | 'createdAt'
> & { conGoogle: boolean };

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoria: AuditoriaService,
    private readonly mail: MailService,
    private readonly auth: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  /** HU-06 */
  async listar(empresaId: string): Promise<UsuarioVista[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: { empresaId },
      orderBy: { createdAt: 'asc' },
    });
    return usuarios.map(aVista);
  }

  /** HU-01: crea el usuario PENDIENTE y envía la invitación. */
  async invitar(
    empresaId: string,
    dto: InvitarUsuarioDto,
    actorId: string,
  ): Promise<UsuarioVista> {
    const email = dto.email.toLowerCase();
    if (await this.prisma.usuario.findUnique({ where: { email } })) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }
    const usuario = await this.prisma.usuario.create({
      data: {
        empresaId,
        nombre: dto.nombre.trim(),
        email,
        rol: dto.rol,
        estado: 'PENDIENTE',
      },
    });
    await this.enviarInvitacion(usuario);
    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: 'INVITAR',
      entidad: 'Usuario',
      entidadId: usuario.id,
      despues: { nombre: usuario.nombre, email, rol: usuario.rol },
    });
    return aVista(usuario);
  }

  /** HU-01: invalida las invitaciones anteriores y envía una nueva. */
  async reenviarInvitacion(
    empresaId: string,
    id: string,
    actorId: string,
  ): Promise<void> {
    const usuario = await this.buscar(empresaId, id);
    if (usuario.estado !== 'PENDIENTE') {
      throw new BadRequestException(
        'Solo se puede reenviar la invitación a usuarios pendientes',
      );
    }
    await this.prisma.tokenAccion.updateMany({
      where: { usuarioId: id, tipo: 'INVITACION', usadoEn: null },
      data: { usadoEn: new Date() },
    });
    await this.enviarInvitacion(usuario);
    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: 'REENVIAR_INVITACION',
      entidad: 'Usuario',
      entidadId: id,
    });
  }

  /** HU-06: cambiar rol o estado, sin dejar a la empresa sin administradores activos. */
  async actualizar(
    empresaId: string,
    id: string,
    dto: ActualizarUsuarioDto,
    actorId: string,
  ): Promise<UsuarioVista> {
    const usuario = await this.buscar(empresaId, id);
    if (dto.estado === 'ACTIVO' && usuario.estado === 'PENDIENTE') {
      throw new BadRequestException(
        'El usuario debe activar su cuenta desde la invitación',
      );
    }

    const dejaDeSerAdminActivo =
      usuario.rol === 'ADMIN' &&
      usuario.estado === 'ACTIVO' &&
      ((dto.rol && dto.rol !== 'ADMIN') || dto.estado === 'INACTIVO');
    if (dejaDeSerAdminActivo) {
      const admins = await this.prisma.usuario.count({
        where: { empresaId, rol: 'ADMIN', estado: 'ACTIVO' },
      });
      if (admins <= 1) {
        throw new BadRequestException(
          'Debe quedar al menos un administrador activo',
        );
      }
    }

    const actualizado = await this.prisma.usuario.update({
      where: { id },
      data: { rol: dto.rol, estado: dto.estado },
    });
    if (dto.estado === 'INACTIVO') await this.auth.revocarSesiones(id);

    await this.auditoria.registrar({
      empresaId,
      usuarioId: actorId,
      accion: 'ACTUALIZAR',
      entidad: 'Usuario',
      entidadId: id,
      antes: { rol: usuario.rol, estado: usuario.estado },
      despues: { rol: actualizado.rol, estado: actualizado.estado },
    });
    return aVista(actualizado);
  }

  private async buscar(empresaId: string, id: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, empresaId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  private async enviarInvitacion(usuario: Usuario): Promise<void> {
    const token = generarToken();
    await this.prisma.tokenAccion.create({
      data: {
        usuarioId: usuario.id,
        tipo: 'INVITACION',
        tokenHash: hashToken(token),
        expiraEn: new Date(Date.now() + HORAS_INVITACION * 3_600_000),
      },
    });
    const url = `${this.config.get('FRONTEND_URL', { infer: true })}/activar?token=${token}`;
    const { asunto, html } = correoInvitacion(
      usuario.nombre,
      url,
      HORAS_INVITACION,
    );
    await this.mail.enviar({ para: usuario.email, asunto, html });
  }
}

function aVista(u: Usuario): UsuarioVista {
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    estado: u.estado,
    ultimoAcceso: u.ultimoAcceso,
    createdAt: u.createdAt,
    conGoogle: Boolean(u.googleId),
  };
}
