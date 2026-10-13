# Guía de configuración local

## Requisitos

- **Node.js 24 LTS.** Con nvm: `nvm install && nvm use` (lee `.nvmrc`).
- **npm 10 o superior.**
- **Docker** con Docker Compose (Docker Desktop en Windows y macOS).
- **Git.**

## Resumen rápido

```bash
git clone git@github.com:DylanSrz/FinancieraRiwi.git && cd FinancieraRiwi
docker compose up -d                                   # PostgreSQL en localhost:5433

cd backend
cp .env.example .env                                   # ya viene listo para local
npm install
npm run prisma:deploy                                  # crea las tablas
npm run prisma:seed                                    # datos base + usuario administrador
npm run start:dev                                      # API → http://localhost:3000/api

# en otra terminal
cd frontend
cp .env.example .env
npm install
npm run dev                                            # App → http://localhost:5173
```

Inicia sesión con **admin@financierariwi.com** y la contraseña **CambiaEsta2026**. Son `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `backend/.env`.

## 1. Base de datos con Docker Compose

`docker-compose.yml` levanta un PostgreSQL 17 en **localhost:5433**. Usa el 5433 para no chocar con un PostgreSQL que ya tengas instalado en el 5432. Crea dos bases:

| Base | Uso |
|---|---|
| `nomina` | Desarrollo (`DATABASE_URL` en `backend/.env`) |
| `nomina_test` | Pruebas e2e: se vacía en cada ejecución |

```bash
docker compose up -d          # iniciar (los datos quedan en un volumen)
docker compose ps             # ver estado
docker compose stop           # detener sin perder datos
docker compose down -v        # borrar todo, incluidos los datos (para empezar de cero)
```

## 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
npm install               # instala dependencias y genera el cliente de Prisma
npm run prisma:deploy     # aplica las migraciones existentes
npm run prisma:seed       # empresa, parámetros 2026, valores hora, bonificaciones y administrador
npm run start:dev         # http://localhost:3000/api (se recarga al guardar)
```

`.env.example` ya funciona en local tal como viene. Solo vas a cambiar estas variables cuando las necesites:

| Variable | Para qué |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Login con Google. Sin ellas la app arranca y el botón de Google responde "no configurado" |
| `RESEND_API_KEY` | Envío real de correos. Sin ella, los correos aparecen en la consola del backend con su enlace |
| `DATABASE_URL` / `DIRECT_URL` | Solo si usas Supabase en vez de Docker |

Herramientas útiles:

- **Swagger** (probar la API): http://localhost:3000/api/docs
- **Health:** http://localhost:3000/api/health
- **Ver y editar la base de datos:** `npm run prisma:studio`

Si cambias `prisma/schema.prisma`, crea la migración con `npm run prisma:migrate -- --name descripcion-del-cambio`.

## 3. Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

Vite reenvía `/api` a `http://localhost:3000`, igual que Vercel en producción, así que el backend tiene que estar corriendo.

## 4. Probar el flujo completo

1. Inicia sesión con el administrador del seed.
2. **Colaboradores → Importar CSV** con `docs/requerimientos/plantilla-colaboradores.csv`: vista previa, errores e importación.
3. **Simulador:** operario, 168 h, 2 hijos → neto **$3.740.295** (CP-01).
4. **Usuarios → Invitar usuario:** sin `RESEND_API_KEY`, la consola del backend muestra `[correo simulado]` con el enlace `http://localhost:5173/activar?token=…`. Ábrelo para activar la cuenta e inicia sesión con ella.

## 5. Pruebas

```bash
# backend/
npm test                  # unitarias (motor, CSV, guards…)
npm run test:e2e          # e2e contra la base nomina_test (necesita docker compose up)

# frontend/
npm test
```

La primera vez, aplica las migraciones en la base de pruebas:

```bash
cd backend
DIRECT_URL=postgresql://postgres:postgres@localhost:5433/nomina_test npx prisma migrate deploy
```

En CI (GitHub Actions) se levanta un PostgreSQL como servicio y se aplican las migraciones antes de las e2e.

## 6. Antes de abrir un PR

En `backend/` y en `frontend/`:

```bash
npm run lint
npm run format:check      # o npm run format para corregir
npm test
npm run build
```

En `backend/` también: `npm run test:e2e`.

## 7. Probar la ejecución programada (Sprint 2)

```bash
curl -X POST http://localhost:3000/api/liquidaciones/ejecucion-programada \
  -H "X-Cron-Secret: <tu CRON_SECRET>"
```

## Problemas comunes

| Síntoma | Solución |
|---|---|
| `Can't reach database server at localhost:5433` | Ejecuta `docker compose up -d` y revisa `docker compose ps` |
| `port is already allocated` al hacer `docker compose up` | Otro contenedor usa el 5433: detenlo (`docker ps`, `docker stop <nombre>`) o cambia el puerto en `docker-compose.yml` y en `.env` |
| `Variables de entorno inválidas` al arrancar | Falta alguna variable en `.env`. Vuelve a copiar `.env.example` |
| `Cannot find module '../generated/prisma/client.js'` | Ejecuta `npm run prisma:generate` |
| Login responde "Correo o contraseña incorrectos" con el admin | No corriste `npm run prisma:seed`, o cambiaste `SEED_ADMIN_PASSWORD` después del seed |
| Las pruebas e2e fallan con `relation … does not exist` | Aplica las migraciones en `nomina_test` (sección 5) |
| Errores de migración en Supabase | `DIRECT_URL` debe apuntar al puerto **5432** (sesión o directa), no al 6543 |
