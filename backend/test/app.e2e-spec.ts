import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configurarApp } from './../src/configurar-app.js';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configurarApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health responde ok sin autenticación', () =>
    request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok')));

  it('GET /api/colaboradores exige JWT', () =>
    request(app.getHttpServer()).get('/api/colaboradores').expect(401));

  it('POST /api/liquidaciones/ejecucion-programada exige el secreto del cron', () =>
    request(app.getHttpServer())
      .post('/api/liquidaciones/ejecucion-programada')
      .expect(401));
});
