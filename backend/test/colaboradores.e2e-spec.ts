import request from 'supertest';
import { Contexto, crearContexto, iniciarSesion } from './utilidades.js';

const CSV = [
  'nombres,apellidos,rol,email,edad,hijos',
  'Ana María,Pérez Gómez,operario,ana.perez@financierariwi.com,29,2',
  'Carlos,Rodríguez Silva,Gerente,carlos.rodriguez@financierariwi.com,45,0',
  'Jorge,Ramírez López,supervisor,jorge.ramirez@financierariwi.com,22,1',
  'Luisa,Martínez,administrador,luisa@financierariwi.com,17,3',
].join('\n');

describe('Colaboradores (HU-07 a HU-10)', () => {
  let ctx: Contexto;
  let token: string;
  const http = () => request(ctx.app.getHttpServer());
  const auth = (r: request.Test) => r.set('Authorization', `Bearer ${token}`);
  const nuevo = {
    nombres: 'Eva',
    apellidos: 'Ruiz',
    email: 'eva@financierariwi.com',
    rol: 'OPERARIO',
    edad: 30,
    hijos: 1,
  };

  beforeAll(async () => {
    ctx = await crearContexto();
    token = (await iniciarSesion(ctx.app)).token;
  });
  afterAll(() => ctx.app.close());

  it('exige autenticación', async () => {
    await http().get('/api/colaboradores').expect(401);
  });

  describe('HU-07 / HU-08 importación CSV', () => {
    it('previsualiza filas válidas e inválidas sin guardar nada', async () => {
      const res = await auth(
        http().post('/api/colaboradores/importaciones/previsualizar'),
      )
        .attach('archivo', Buffer.from(CSV), 'colaboradores.csv')
        .expect(201);
      expect(res.body.total).toBe(4);
      expect(
        res.body.validas.map((v: { fila: number; accion: string }) => [
          v.fila,
          v.accion,
        ]),
      ).toEqual([
        [2, 'crear'],
        [3, 'crear'],
      ]);
      expect(res.body.invalidas.map((v: { fila: number }) => v.fila)).toEqual([
        4, 5,
      ]);
      expect(await ctx.prisma.colaborador.count()).toBe(0);
    });

    it('importa solo las filas válidas y luego actualiza por email', async () => {
      const r1 = await auth(http().post('/api/colaboradores/importaciones'))
        .attach('archivo', Buffer.from(CSV), 'colaboradores.csv')
        .expect(201);
      expect(r1.body).toEqual({ creados: 2, actualizados: 0, rechazados: 2 });

      const r2 = await auth(http().post('/api/colaboradores/importaciones'))
        .attach(
          'archivo',
          Buffer.from(CSV.replace(',29,2', ',30,3')),
          'colaboradores.csv',
        )
        .expect(201);
      expect(r2.body).toEqual({ creados: 0, actualizados: 2, rechazados: 2 });
      const ana = await ctx.prisma.colaborador.findFirstOrThrow({
        where: { email: 'ana.perez@financierariwi.com' },
      });
      expect(ana).toMatchObject({ edad: 30, hijos: 3, rol: 'OPERARIO' });
      expect(
        await ctx.prisma.auditoria.count({ where: { accion: 'IMPORTAR_CSV' } }),
      ).toBe(2);
    });

    it('rechaza archivos que no son CSV o sin columnas obligatorias', async () => {
      await auth(http().post('/api/colaboradores/importaciones/previsualizar'))
        .attach('archivo', Buffer.from(CSV), 'colaboradores.xlsx')
        .expect(400);
      const res = await auth(
        http().post('/api/colaboradores/importaciones/previsualizar'),
      )
        .attach('archivo', Buffer.from('nombre,correo\nAna,a@b.co'), 'malo.csv')
        .expect(400);
      expect(res.body.message).toMatch(/Faltan columnas obligatorias/);
      await auth(
        http().post('/api/colaboradores/importaciones/previsualizar'),
      ).expect(400);
    });
  });

  describe('HU-09 crear, editar y desactivar', () => {
    let id: string;

    it('crea un colaborador con las validaciones del CSV', async () => {
      await auth(http().post('/api/colaboradores'))
        .send({ ...nuevo, edad: 16 })
        .expect(400);
      const res = await auth(http().post('/api/colaboradores'))
        .send(nuevo)
        .expect(201);
      id = res.body.id;
      expect(res.body).toMatchObject({
        email: 'eva@financierariwi.com',
        activo: true,
        claseRiesgoArl: 1,
      });
    });

    it('rechaza un email duplicado (409)', async () => {
      await auth(http().post('/api/colaboradores'))
        .send({ ...nuevo, email: 'EVA@financierariwi.com' })
        .expect(409);
    });

    it('registra en auditoría el valor anterior y el nuevo', async () => {
      await auth(http().patch(`/api/colaboradores/${id}`))
        .send({ hijos: 2 })
        .expect(200);
      const evento = await ctx.prisma.auditoria.findFirstOrThrow({
        where: { entidadId: id, accion: 'ACTUALIZAR' },
      });
      expect(evento.antes).toMatchObject({ hijos: 1 });
      expect(evento.despues).toMatchObject({ hijos: 2 });
    });

    it('desactiva sin borrar y lo excluye del listado de activos', async () => {
      await auth(http().delete(`/api/colaboradores/${id}`)).expect(200);
      expect(
        await ctx.prisma.colaborador.findUnique({ where: { id } }),
      ).toMatchObject({ activo: false });
      const activos = await auth(http().get('/api/colaboradores')).expect(200);
      expect(activos.body.datos.map((c: { id: string }) => c.id)).not.toContain(
        id,
      );
      const inactivos = await auth(
        http().get('/api/colaboradores?estado=inactivos'),
      ).expect(200);
      expect(inactivos.body.datos.map((c: { id: string }) => c.id)).toEqual([
        id,
      ]);
    });

    it('responde 404 para un colaborador inexistente', async () => {
      await auth(
        http().patch('/api/colaboradores/00000000-0000-4000-8000-000000000000'),
      )
        .send({ hijos: 1 })
        .expect(404);
    });
  });

  describe('HU-10 listar y buscar', () => {
    it('busca por nombre, apellido o email sin distinguir mayúsculas', async () => {
      const res = await auth(
        http().get('/api/colaboradores?q=RODRÍGUEZ'),
      ).expect(200);
      expect(res.body.datos.map((c: { nombres: string }) => c.nombres)).toEqual(
        ['Carlos'],
      );
    });

    it('filtra por rol y pagina', async () => {
      const porRol = await auth(
        http().get('/api/colaboradores?rol=GERENTE'),
      ).expect(200);
      expect(porRol.body.total).toBe(1);
      const pagina = await auth(
        http().get('/api/colaboradores?porPagina=1&pagina=2'),
      ).expect(200);
      expect(pagina.body).toMatchObject({ total: 2, pagina: 2, porPagina: 1 });
      expect(pagina.body.datos).toHaveLength(1);
    });
  });
});
