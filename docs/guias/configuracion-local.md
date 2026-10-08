# Guía de configuración local

## Requisitos

- **Node.js 24 LTS.** Con nvm: `nvm install && nvm use` (lee `.nvmrc`).
- **npm 10 o superior.**
- **Una base de datos PostgreSQL**, de una de estas formas:
  - un proyecto de Supabase de desarrollo (recomendado, ver [configuracion-servicios.md](configuracion-servicios.md)), o
  - PostgreSQL local: `docker run --name nomina-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17`.
- **Git.**

## 1. Clonar el repositorio

```bash
git clone git@github.com:DylanSrz/FinancieraRiwi.git
cd FinancieraRiwi
```

## 2. Backend

```bash
cd backend
cp .env.example .env
```

Edita `.env`:

| Variable | Valor en local |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Las cadenas de Supabase. Con PostgreSQL local, ambas `postgresql://postgres:postgres@localhost:5432/postgres` |
| `JWT_ACCESS_SECRET`, `CRON_SECRET` | Genera cada una con `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `GOOGLE_*` | Opcional al inicio. Sin estas variables, el login con Google no funciona, pero la app arranca |
| `RESEND_API_KEY` | Opcional. Sin ella, los correos se muestran en la consola |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Tu correo y una contraseña para el primer administrador |

```bash
npm install               # instala dependencias y genera el cliente de Prisma
npm run prisma:migrate    # crea o actualiza las tablas (pide un nombre si hay cambios)
npm run prisma:seed       # carga empresa, parámetros 2026, valores hora y administrador
npm run start:dev         # http://localhost:3000/api
```

- **Swagger:** http://localhost:3000/api/docs
- **Health:** http://localhost:3000/api/health
- **Base de datos:** `npm run prisma:studio`

## 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

- **Llamadas a la API:** Vite reenvía `/api` a `http://localhost:3000`.
- **Navegar sin login:** mientras no esté implementado, puedes poner `VITE_DEMO_SIN_AUTH=true` en `frontend/.env`.

## 4. Antes de abrir un PR

En `backend/` y en `frontend/`:

```bash
npm run lint
npm run format:check      # o npm run format para corregir
npm test
npm run build
```

En `backend/` también: `npm run test:e2e`.

## 5. Probar la ejecución programada en local

```bash
curl -X POST http://localhost:3000/api/liquidaciones/ejecucion-programada \
  -H "X-Cron-Secret: <tu CRON_SECRET>"
```

## Problemas comunes

| Síntoma | Solución |
|---|---|
| `Variables de entorno inválidas` al arrancar | Revisa que `.env` tenga todas las variables obligatorias y que los secretos tengan 32 caracteres o más |
| `Cannot find module '../generated/prisma/client.js'` | Ejecuta `npm run prisma:generate` |
| Errores de migración en Supabase | `DIRECT_URL` debe apuntar al puerto **5432** (modo sesión o directa), no al 6543 |
| 401 en todas las rutas | Es lo esperado sin token. Usa `/api/health` para verificar que la API responde |
