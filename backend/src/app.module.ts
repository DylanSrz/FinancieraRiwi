import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditoriaModule } from './auditoria/auditoria.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { ColaboradoresModule } from './colaboradores/colaboradores.module.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { validateEnv } from './config/env.validation.js';
import { EjecucionProgramadaModule } from './ejecucion-programada/ejecucion-programada.module.js';
import { HealthModule } from './health/health.module.js';
import { HorasModule } from './horas/horas.module.js';
import { LiquidacionModule } from './liquidacion/liquidacion.module.js';
import { MailModule } from './mail/mail.module.js';
import { ParametrosModule } from './parametros/parametros.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ReportesModule } from './reportes/reportes.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      cache: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    MailModule,
    AuditoriaModule,
    HealthModule,
    AuthModule,
    UsuariosModule,
    ColaboradoresModule,
    HorasModule,
    ParametrosModule,
    LiquidacionModule,
    EjecucionProgramadaModule,
    ReportesModule,
  ],
  providers: [
    // Orden: límite de peticiones → JWT → roles.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
