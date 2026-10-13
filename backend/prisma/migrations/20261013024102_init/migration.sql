-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'AUX_CONTABLE');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoTokenAccion" AS ENUM ('INVITACION', 'RECUPERACION');

-- CreateEnum
CREATE TYPE "RolColaborador" AS ENUM ('GERENTE', 'ADMINISTRADOR', 'OPERARIO');

-- CreateEnum
CREATE TYPE "EstadoPeriodo" AS ENUM ('ABIERTO', 'CALCULADO', 'CERRADO');

-- CreateEnum
CREATE TYPE "OrigenEjecucion" AS ENUM ('PROGRAMADA', 'MANUAL');

-- CreateEnum
CREATE TYPE "EstadoEjecucion" AS ENUM ('EN_CURSO', 'EXITOSA', 'CON_ADVERTENCIAS', 'FALLIDA');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Bogota',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoHasta" TIMESTAMP(3),
    "ultimoAcceso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "familia" UUID NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "revocadoEn" TIMESTAMP(3),
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_accion" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "tipo" "TipoTokenAccion" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_accion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaboradores" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "RolColaborador" NOT NULL,
    "edad" INTEGER NOT NULL,
    "hijos" INTEGER NOT NULL DEFAULT 0,
    "claseRiesgoArl" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colaboradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodos" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "fechaCorte" DATE NOT NULL,
    "estado" "EstadoPeriodo" NOT NULL DEFAULT 'ABIERTO',
    "cerradoPorId" UUID,
    "cerradoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "periodos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_horas" (
    "id" UUID NOT NULL,
    "periodoId" UUID NOT NULL,
    "colaboradorId" UUID NOT NULL,
    "horas" DECIMAL(6,2) NOT NULL,
    "registradoPorId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registros_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametros_legales" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "anio" INTEGER NOT NULL,
    "smmlv" DECIMAL(14,2) NOT NULL,
    "auxilioTransporte" DECIMAL(14,2) NOT NULL,
    "topeAuxilioSmmlv" DECIMAL(5,2) NOT NULL DEFAULT 2,
    "saludEmpleado" DECIMAL(7,5) NOT NULL,
    "pensionEmpleado" DECIMAL(7,5) NOT NULL,
    "saludEmpleador" DECIMAL(7,5) NOT NULL,
    "pensionEmpleador" DECIMAL(7,5) NOT NULL,
    "cajaCompensacion" DECIMAL(7,5) NOT NULL,
    "icbf" DECIMAL(7,5) NOT NULL,
    "sena" DECIMAL(7,5) NOT NULL,
    "topeExoneracionSmmlv" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "horasMaxMes" DECIMAL(6,2) NOT NULL,
    "fspTramos" JSONB NOT NULL,
    "arlTarifas" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametros_legales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valores_hora_rol" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "rol" "RolColaborador" NOT NULL,
    "valorHora" DECIMAL(14,2) NOT NULL,
    "vigenteDesde" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valores_hora_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonificaciones_hijos" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "hijos" INTEGER NOT NULL,
    "valor" DECIMAL(14,2) NOT NULL,
    "vigenteDesde" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonificaciones_hijos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejecuciones" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "periodoId" UUID NOT NULL,
    "origen" "OrigenEjecucion" NOT NULL,
    "estado" "EstadoEjecucion" NOT NULL DEFAULT 'EN_CURSO',
    "ejecutadaPorId" UUID,
    "iniciadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadaEn" TIMESTAMP(3),
    "totalColaboradores" INTEGER NOT NULL DEFAULT 0,
    "totalNeto" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "advertencias" JSONB,
    "error" TEXT,

    CONSTRAINT "ejecuciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liquidaciones" (
    "id" UUID NOT NULL,
    "periodoId" UUID NOT NULL,
    "colaboradorId" UUID NOT NULL,
    "ejecucionId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "horas" DECIMAL(6,2) NOT NULL,
    "valorHora" DECIMAL(14,2) NOT NULL,
    "hijos" INTEGER NOT NULL,
    "devengadoBasico" DECIMAL(14,2) NOT NULL,
    "bonificacionHijos" DECIMAL(14,2) NOT NULL,
    "auxilioTransporte" DECIMAL(14,2) NOT NULL,
    "totalDevengado" DECIMAL(14,2) NOT NULL,
    "ibc" DECIMAL(14,2) NOT NULL,
    "saludEmpleado" DECIMAL(14,2) NOT NULL,
    "pensionEmpleado" DECIMAL(14,2) NOT NULL,
    "fsp" DECIMAL(14,2) NOT NULL,
    "totalDeducciones" DECIMAL(14,2) NOT NULL,
    "netoPagar" DECIMAL(14,2) NOT NULL,
    "saludEmpleador" DECIMAL(14,2) NOT NULL,
    "pensionEmpleador" DECIMAL(14,2) NOT NULL,
    "arl" DECIMAL(14,2) NOT NULL,
    "cajaCompensacion" DECIMAL(14,2) NOT NULL,
    "icbf" DECIMAL(14,2) NOT NULL,
    "sena" DECIMAL(14,2) NOT NULL,
    "cesantias" DECIMAL(14,2) NOT NULL,
    "interesesCesantias" DECIMAL(14,2) NOT NULL,
    "prima" DECIMAL(14,2) NOT NULL,
    "vacaciones" DECIMAL(14,2) NOT NULL,
    "costoEmpleador" DECIMAL(14,2) NOT NULL,
    "parametrosUsados" JSONB NOT NULL,
    "alertas" JSONB,
    "estadoEnvio" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "enviadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liquidaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "usuarioId" UUID,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "antes" JSONB,
    "despues" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nit_key" ON "empresas"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_googleId_key" ON "usuarios"("googleId");

-- CreateIndex
CREATE INDEX "usuarios_empresaId_idx" ON "usuarios"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_usuarioId_idx" ON "refresh_tokens"("usuarioId");

-- CreateIndex
CREATE INDEX "refresh_tokens_familia_idx" ON "refresh_tokens"("familia");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_accion_tokenHash_key" ON "tokens_accion"("tokenHash");

-- CreateIndex
CREATE INDEX "tokens_accion_usuarioId_tipo_idx" ON "tokens_accion"("usuarioId", "tipo");

-- CreateIndex
CREATE INDEX "colaboradores_empresaId_activo_idx" ON "colaboradores"("empresaId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_empresaId_email_key" ON "colaboradores"("empresaId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "periodos_empresaId_anio_mes_key" ON "periodos"("empresaId", "anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "registros_horas_periodoId_colaboradorId_key" ON "registros_horas"("periodoId", "colaboradorId");

-- CreateIndex
CREATE UNIQUE INDEX "parametros_legales_empresaId_anio_key" ON "parametros_legales"("empresaId", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "valores_hora_rol_empresaId_rol_vigenteDesde_key" ON "valores_hora_rol"("empresaId", "rol", "vigenteDesde");

-- CreateIndex
CREATE UNIQUE INDEX "bonificaciones_hijos_empresaId_hijos_vigenteDesde_key" ON "bonificaciones_hijos"("empresaId", "hijos", "vigenteDesde");

-- CreateIndex
CREATE INDEX "ejecuciones_periodoId_idx" ON "ejecuciones"("periodoId");

-- CreateIndex
CREATE UNIQUE INDEX "liquidaciones_periodoId_colaboradorId_key" ON "liquidaciones"("periodoId", "colaboradorId");

-- CreateIndex
CREATE INDEX "auditorias_empresaId_createdAt_idx" ON "auditorias"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "auditorias_entidad_entidadId_idx" ON "auditorias"("entidad", "entidadId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_accion" ADD CONSTRAINT "tokens_accion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos" ADD CONSTRAINT "periodos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos" ADD CONSTRAINT "periodos_cerradoPorId_fkey" FOREIGN KEY ("cerradoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametros_legales" ADD CONSTRAINT "parametros_legales_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valores_hora_rol" ADD CONSTRAINT "valores_hora_rol_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonificaciones_hijos" ADD CONSTRAINT "bonificaciones_hijos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejecuciones" ADD CONSTRAINT "ejecuciones_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejecuciones" ADD CONSTRAINT "ejecuciones_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejecuciones" ADD CONSTRAINT "ejecuciones_ejecutadaPorId_fkey" FOREIGN KEY ("ejecutadaPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_ejecucionId_fkey" FOREIGN KEY ("ejecucionId") REFERENCES "ejecuciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
