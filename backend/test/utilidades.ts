import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { configurarApp } from '../src/configurar-app.js';
import { MailService } from '../src/mail/mail.service.js';
import { sembrarDatosBase } from '../src/prisma/datos-base.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

export const ADMIN = {
  email: 'admin@financierariwi.com',
  password: 'Admin2026',
};

export interface Contexto {
  app: INestApplication<App>;
  prisma: PrismaService;
  /** Correos "enviados" durante la prueba. */
  correos: { para: string | string[]; asunto: string; html: string }[];
  empresaId: string;
}

/** Levanta la app con una BD limpia, datos base y el administrador. */
export async function crearContexto(): Promise<Contexto> {
  const correos: Contexto['correos'] = [];
  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MailService)
    .useValue({
      enviar: vi.fn(
        async (c: Contexto['correos'][number]) => (
          correos.push(c),
          { id: null }
        ),
      ),
    })
    .compile();
  const app = modulo.createNestApplication<INestApplication<App>>();
  configurarApp(app);
  await app.init();

  const prisma = app.get(PrismaService);
  await limpiarBd(prisma);
  const { empresa } = await sembrarDatosBase(prisma, {
    adminEmail: ADMIN.email,
    adminPassword: ADMIN.password,
  });
  return { app, prisma, correos, empresaId: empresa.id };
}

export async function limpiarBd(prisma: PrismaService): Promise<void> {
  const tablas = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  if (tablas.length) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE ${tablas.map((t) => `"${t.tablename}"`).join(', ')} RESTART IDENTITY CASCADE`,
    );
  }
}

/** Inicia sesión y devuelve el access token y la cookie de refresh. */
export async function iniciarSesion(
  app: INestApplication<App>,
  email = ADMIN.email,
  password = ADMIN.password,
) {
  const res = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);
  const cookie = ([] as string[])
    .concat(res.headers['set-cookie'] ?? [])
    .find((c) => c.startsWith('nomina_rt='));
  return {
    token: res.body.accessToken as string,
    cookie: cookie!.split(';')[0],
  };
}

/** Extrae el token de un enlace enviado por correo. */
export function tokenDelCorreo(html: string): string {
  const coincidencia = /token=([A-Za-z0-9_-]+)/.exec(html);
  if (!coincidencia)
    throw new Error('El correo no contiene un enlace con token');
  return coincidencia[1];
}
