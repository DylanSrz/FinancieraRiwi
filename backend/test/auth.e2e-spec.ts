import request from 'supertest';
import {
  ADMIN,
  Contexto,
  crearContexto,
  iniciarSesion,
  tokenDelCorreo,
} from './utilidades.js';

describe('Autenticación (HU-01, HU-02, HU-05)', () => {
  let ctx: Contexto;
  const http = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await crearContexto();
  });
  afterAll(() => ctx.app.close());

  describe('HU-02 login', () => {
    it('emite access token y cookie httpOnly de refresh', async () => {
      const res = await http().post('/api/auth/login').send(ADMIN).expect(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.refreshToken).toBeUndefined();
      const cookie = String(res.headers['set-cookie']);
      expect(cookie).toMatch(
        /nomina_rt=.+; Path=\/api\/auth; Expires=.+; HttpOnly; SameSite=Strict/,
      );
    });

    it('acepta el correo sin importar mayúsculas', async () => {
      await http()
        .post('/api/auth/login')
        .send({ ...ADMIN, email: ADMIN.email.toUpperCase() })
        .expect(200);
    });

    it('rechaza credenciales incorrectas con un mensaje genérico', async () => {
      const malaClave = await http()
        .post('/api/auth/login')
        .send({ ...ADMIN, password: 'Incorrecta1' })
        .expect(401);
      const noExiste = await http()
        .post('/api/auth/login')
        .send({ email: 'nadie@x.co', password: 'Incorrecta1' })
        .expect(401);
      expect(malaClave.body.message).toBe('Correo o contraseña incorrectos');
      expect(noExiste.body.message).toBe(malaClave.body.message);
    });

    it('bloquea la cuenta 15 minutos tras 5 intentos fallidos', async () => {
      const email = 'bloqueo@financierariwi.com';
      await ctx.prisma.usuario.create({
        data: {
          empresaId: ctx.empresaId,
          nombre: 'Bloqueo',
          email,
          rol: 'AUX_CONTABLE',
          estado: 'ACTIVO',
          passwordHash: (
            await ctx.prisma.usuario.findUniqueOrThrow({
              where: { email: ADMIN.email },
            })
          ).passwordHash,
        },
      });
      for (let i = 0; i < 5; i++) {
        await http()
          .post('/api/auth/login')
          .send({ email, password: 'Incorrecta1' })
          .expect(401);
      }
      const res = await http()
        .post('/api/auth/login')
        .send({ email, password: ADMIN.password })
        .expect(401);
      expect(res.body.message).toMatch(/bloqueada temporalmente/);
    });

    it('valida el cuerpo de la petición', async () => {
      await http()
        .post('/api/auth/login')
        .send({ email: 'no-es-email', password: '1' })
        .expect(400);
    });
  });

  describe('HU-05 sesión', () => {
    it('/auth/me devuelve el perfil con el token', async () => {
      const { token } = await iniciarSesion(ctx.app);
      const res = await http()
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body).toMatchObject({
        email: ADMIN.email,
        rol: 'ADMIN',
        nombre: 'Administrador',
      });
    });

    it('rota el refresh token y detecta su reutilización', async () => {
      const { cookie } = await iniciarSesion(ctx.app);
      const r1 = await http()
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .expect(200);
      expect(r1.body.accessToken).toEqual(expect.any(String));
      const nueva = String(r1.headers['set-cookie']).split(';')[0];
      expect(nueva).not.toBe(cookie);

      // Reutilizar el token viejo revoca toda la familia, incluida la cookie nueva.
      await http().post('/api/auth/refresh').set('Cookie', cookie).expect(401);
      await http().post('/api/auth/refresh').set('Cookie', nueva).expect(401);
    });

    it('logout revoca el refresh token', async () => {
      const { cookie } = await iniciarSesion(ctx.app);
      await http().post('/api/auth/logout').set('Cookie', cookie).expect(204);
      await http().post('/api/auth/refresh').set('Cookie', cookie).expect(401);
    });

    it('refresh sin cookie responde 401', async () => {
      await http().post('/api/auth/refresh').expect(401);
    });
  });

  describe('HU-01 invitación y activación', () => {
    it('el invitado activa su cuenta con el enlace del correo y puede iniciar sesión', async () => {
      const { token } = await iniciarSesion(ctx.app);
      const inv = await http()
        .post('/api/usuarios/invitaciones')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Laura Gómez',
          email: 'Laura@FinancieraRiwi.com',
          rol: 'AUX_CONTABLE',
        })
        .expect(201);
      expect(inv.body).toMatchObject({
        email: 'laura@financierariwi.com',
        estado: 'PENDIENTE',
      });

      const correo = ctx.correos.at(-1)!;
      expect(correo.para).toBe('laura@financierariwi.com');
      const enlace = tokenDelCorreo(correo.html);

      await http()
        .post('/api/auth/login')
        .send({ email: 'laura@financierariwi.com', password: 'Laura2026' })
        .expect(401);
      await http()
        .post('/api/auth/activar')
        .send({ token: enlace, password: 'debil' })
        .expect(400);
      await http()
        .post('/api/auth/activar')
        .send({ token: enlace, password: 'Laura2026' })
        .expect(204);
      await iniciarSesion(ctx.app, 'laura@financierariwi.com', 'Laura2026');

      const reuso = await http()
        .post('/api/auth/activar')
        .send({ token: enlace, password: 'Otra2026x' })
        .expect(401);
      expect(reuso.body.message).toBe('El enlace no es válido o ha expirado');
    });

    it('rechaza un enlace vencido', async () => {
      const { token } = await iniciarSesion(ctx.app);
      await http()
        .post('/api/usuarios/invitaciones')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Pedro Ruiz',
          email: 'pedro@financierariwi.com',
          rol: 'AUX_CONTABLE',
        })
        .expect(201);
      const enlace = tokenDelCorreo(ctx.correos.at(-1)!.html);
      await ctx.prisma.tokenAccion.updateMany({
        data: { expiraEn: new Date(Date.now() - 1000) },
      });
      await http()
        .post('/api/auth/activar')
        .send({ token: enlace, password: 'Pedro2026' })
        .expect(401);
    });
  });

  it('HU-03 Google responde 503 si no está configurado', async () => {
    await http().get('/api/auth/google').expect(503);
  });
});
