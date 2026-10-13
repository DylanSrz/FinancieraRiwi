import request from 'supertest';
import {
  Contexto,
  crearContexto,
  iniciarSesion,
  tokenDelCorreo,
} from './utilidades.js';

describe('Parámetros y simulador (HU-12 a HU-15, HU-21, HU-22)', () => {
  let ctx: Contexto;
  let admin: string;
  let aux: string;
  const http = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await crearContexto();
    admin = (await iniciarSesion(ctx.app)).token;
    await http()
      .post('/api/usuarios/invitaciones')
      .set('Authorization', `Bearer ${admin}`)
      .send({
        nombre: 'Aux',
        email: 'aux@financierariwi.com',
        rol: 'AUX_CONTABLE',
      })
      .expect(201);
    await http()
      .post('/api/auth/activar')
      .send({
        token: tokenDelCorreo(ctx.correos.at(-1)!.html),
        password: 'Clave2026',
      });
    aux = (await iniciarSesion(ctx.app, 'aux@financierariwi.com', 'Clave2026'))
      .token;
  });
  afterAll(() => ctx.app.close());

  describe('HU-21 parámetros legales', () => {
    it('trae precargado 2026', async () => {
      const res = await http()
        .get('/api/parametros/legales/2026')
        .set('Authorization', `Bearer ${aux}`)
        .expect(200);
      expect(res.body).toMatchObject({
        anio: 2026,
        smmlv: 1_750_905,
        auxilioTransporte: 249_095,
        saludEmpleado: 0.04,
      });
      expect(res.body.fspTramos).toHaveLength(6);
    });

    it('responde 404 para un año sin parámetros', async () => {
      const res = await http()
        .get('/api/parametros/legales/2030')
        .set('Authorization', `Bearer ${aux}`)
        .expect(404);
      expect(res.body.message).toBe(
        'No hay parámetros legales para el año 2030',
      );
    });

    it('solo ADMIN puede registrar un año', async () => {
      const base = (
        await http()
          .get('/api/parametros/legales/2026')
          .set('Authorization', `Bearer ${admin}`)
      ).body;
      const { anio: _a, actualizadoEn: _b, ...dto } = base;
      const p2027 = { ...dto, smmlv: 2_000_000 };
      await http()
        .put('/api/parametros/legales/2027')
        .set('Authorization', `Bearer ${aux}`)
        .send(p2027)
        .expect(403);
      await http()
        .put('/api/parametros/legales/2027')
        .set('Authorization', `Bearer ${admin}`)
        .send({ ...p2027, saludEmpleado: 4 })
        .expect(400);
      const res = await http()
        .put('/api/parametros/legales/2027')
        .set('Authorization', `Bearer ${admin}`)
        .send(p2027)
        .expect(200);
      expect(res.body).toMatchObject({ anio: 2027, smmlv: 2_000_000 });
      const anios = await http()
        .get('/api/parametros/legales')
        .set('Authorization', `Bearer ${aux}`)
        .expect(200);
      expect(anios.body).toEqual([2027, 2026]);
    });
  });

  describe('HU-22 valor hora por rol', () => {
    it('trae los valores iniciales vigentes', async () => {
      const res = await http()
        .get('/api/parametros/valores-hora')
        .set('Authorization', `Bearer ${aux}`)
        .expect(200);
      expect(
        res.body.vigentes.map((v: { rol: string; valorHora: number }) => [
          v.rol,
          v.valorHora,
        ]),
      ).toEqual([
        ['GERENTE', 50_000],
        ['ADMINISTRADOR', 35_000],
        ['OPERARIO', 20_000],
      ]);
    });

    it('un nuevo valor con vigencia futura no afecta liquidaciones anteriores (CP-10)', async () => {
      await http()
        .post('/api/parametros/valores-hora')
        .set('Authorization', `Bearer ${admin}`)
        .send({
          rol: 'OPERARIO',
          valorHora: 22_000,
          vigenteDesde: '2026-11-01',
        })
        .expect(201);
      await http()
        .post('/api/parametros/valores-hora')
        .set('Authorization', `Bearer ${admin}`)
        .send({
          rol: 'OPERARIO',
          valorHora: 23_000,
          vigenteDesde: '2026-11-01',
        })
        .expect(409);

      const simular = (fechaCorte: string) =>
        http()
          .post('/api/liquidaciones/simular')
          .set('Authorization', `Bearer ${aux}`)
          .send({ rol: 'OPERARIO', horas: 100, hijos: 0, fechaCorte })
          .expect(200);
      expect((await simular('2026-10-30')).body.resultado.valorHora).toBe(
        20_000,
      );
      expect((await simular('2026-11-30')).body.resultado.valorHora).toBe(
        22_000,
      );
    });
  });

  describe('Simulador (motor HU-12 a HU-15 con parámetros de la BD)', () => {
    it('CP-01 operario 168 h, 2 hijos → neto $3.740.295', async () => {
      const res = await http()
        .post('/api/liquidaciones/simular')
        .set('Authorization', `Bearer ${aux}`)
        .send({
          rol: 'OPERARIO',
          horas: 168,
          hijos: 2,
          fechaCorte: '2026-10-30',
        })
        .expect(200);
      expect(res.body.resultado).toMatchObject({
        devengadoBasico: 3_360_000,
        bonificacionHijos: 400_000,
        auxilioTransporte: 249_095,
        netoPagar: 3_740_295,
        costoEmpleador: 5_341_841,
      });
    });

    it('CP-09 sin parámetros del año responde 404', async () => {
      await http()
        .post('/api/liquidaciones/simular')
        .set('Authorization', `Bearer ${aux}`)
        .send({
          rol: 'OPERARIO',
          horas: 168,
          hijos: 2,
          fechaCorte: '2031-01-30',
        })
        .expect(404);
    });
  });
});
