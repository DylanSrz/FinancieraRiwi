import request from 'supertest';
import {
  Contexto,
  crearContexto,
  iniciarSesion,
  tokenDelCorreo,
} from './utilidades.js';

describe('Usuarios (HU-01, HU-06)', () => {
  let ctx: Contexto;
  let admin: string;
  const http = () => request(ctx.app.getHttpServer());
  const comoAdmin = (r: request.Test) =>
    r.set('Authorization', `Bearer ${admin}`);

  beforeAll(async () => {
    ctx = await crearContexto();
    admin = (await iniciarSesion(ctx.app)).token;
  });
  afterAll(() => ctx.app.close());

  async function crearAuxActivo(email: string) {
    const inv = await comoAdmin(http().post('/api/usuarios/invitaciones'))
      .send({ nombre: 'Aux Contable', email, rol: 'AUX_CONTABLE' })
      .expect(201);
    await http()
      .post('/api/auth/activar')
      .send({
        token: tokenDelCorreo(ctx.correos.at(-1)!.html),
        password: 'Clave2026',
      })
      .expect(204);
    return inv.body.id as string;
  }

  it('lista los usuarios sin exponer hashes', async () => {
    const res = await comoAdmin(http().get('/api/usuarios')).expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).not.toHaveProperty('passwordHash');
  });

  it('rechaza invitar un correo ya registrado (409)', async () => {
    await comoAdmin(http().post('/api/usuarios/invitaciones'))
      .send({ nombre: 'Otro', email: 'admin@financierariwi.com', rol: 'ADMIN' })
      .expect(409);
  });

  it('AUX_CONTABLE recibe 403 en usuarios', async () => {
    await crearAuxActivo('aux1@financierariwi.com');
    const { token } = await iniciarSesion(
      ctx.app,
      'aux1@financierariwi.com',
      'Clave2026',
    );
    await http()
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('desactivar a un usuario revoca sus sesiones e impide el login', async () => {
    const id = await crearAuxActivo('aux2@financierariwi.com');
    const { cookie } = await iniciarSesion(
      ctx.app,
      'aux2@financierariwi.com',
      'Clave2026',
    );
    await comoAdmin(http().patch(`/api/usuarios/${id}`))
      .send({ estado: 'INACTIVO' })
      .expect(200);
    await http().post('/api/auth/refresh').set('Cookie', cookie).expect(401);
    await http()
      .post('/api/auth/login')
      .send({ email: 'aux2@financierariwi.com', password: 'Clave2026' })
      .expect(401);
  });

  it('no permite quitar el rol al único administrador', async () => {
    const yo = await comoAdmin(http().get('/api/auth/me')).expect(200);
    const res = await comoAdmin(http().patch(`/api/usuarios/${yo.body.id}`))
      .send({ rol: 'AUX_CONTABLE' })
      .expect(400);
    expect(res.body.message).toBe(
      'Debe quedar al menos un administrador activo',
    );
  });

  it('reenvía la invitación solo a usuarios pendientes', async () => {
    const inv = await comoAdmin(http().post('/api/usuarios/invitaciones'))
      .send({
        nombre: 'Pendiente',
        email: 'pendiente@financierariwi.com',
        rol: 'AUX_CONTABLE',
      })
      .expect(201);
    const primerEnlace = tokenDelCorreo(ctx.correos.at(-1)!.html);
    await comoAdmin(
      http().post(`/api/usuarios/${inv.body.id}/reenviar-invitacion`),
    ).expect(204);
    await http()
      .post('/api/auth/activar')
      .send({ token: primerEnlace, password: 'Clave2026' })
      .expect(401);
    await http()
      .post('/api/auth/activar')
      .send({
        token: tokenDelCorreo(ctx.correos.at(-1)!.html),
        password: 'Clave2026',
      })
      .expect(204);
    await comoAdmin(
      http().post(`/api/usuarios/${inv.body.id}/reenviar-invitacion`),
    ).expect(400);
  });

  it('registra las acciones en auditoría', async () => {
    const acciones = await ctx.prisma.auditoria.findMany({
      where: { entidad: 'Usuario' },
    });
    expect(acciones.map((a) => a.accion)).toEqual(
      expect.arrayContaining(['INVITAR', 'ACTUALIZAR', 'REENVIAR_INVITACION']),
    );
  });
});
