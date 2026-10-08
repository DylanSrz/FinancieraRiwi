# Guía de configuración de servicios externos

Responsable: @Kerin0011 (BD/DevOps). Tareas: T-15, T-16, T-17, T-18, T-19.

> ⚠️ **Nunca** pegues llaves ni contraseñas en issues, PRs o el chat del equipo. Compártelas por un canal privado y guárdalas solo en `.env` (local) y en los paneles de Render y Vercel.

## 1. Supabase (base de datos) — T-15

1. Crea el proyecto `financiera-riwi` en https://supabase.com, en la región más cercana (por ejemplo, `us-east-1`), y guarda la contraseña de la base de datos.
2. Ve a **Project Settings → Database → Connection string** y copia dos cadenas:
   - **Transaction pooler** (puerto 6543): va en `DATABASE_URL`, agregando `?pgbouncer=true` al final.
   - **Session pooler** o **Direct** (puerto 5432): va en `DIRECT_URL`.
3. En local, desde `backend/`, aplica las migraciones y el seed:
   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```
4. **Ejecución programada (T-17)**, una vez desplegada la API:
   1. En **Database → Extensions**, habilita `pg_cron` y `pg_net`.
   2. Abre el **SQL Editor**, pega `backend/prisma/sql/programar-liquidacion.sql`, reemplaza `<URL_API>` y `<CRON_SECRET>`, y ejecútalo.
   3. Verifica con `select * from cron.job;`.

## 2. Google OAuth — T-16

1. En https://console.cloud.google.com, crea el proyecto `FinancieraRiwi`.
2. Configura **APIs & Services → OAuth consent screen**:
   - tipo *External*;
   - nombre "Nómina Riwi";
   - scopes `email` y `profile`;
   - agrega como *test users* los correos del equipo.
3. En **Credentials → Create credentials → OAuth client ID**, elige el tipo *Web application* y configura:
   - **Authorized JavaScript origins:** `http://localhost:5173`, `https://<proyecto>.vercel.app`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/google/callback`, `https://<proyecto>.vercel.app/api/auth/google/callback`
4. Copia los valores en `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`, y en `GOOGLE_CALLBACK_URL` pon la URI que corresponda a cada entorno.

## 3. Resend (correo) — T-16

1. Crea una cuenta en https://resend.com y ve a **API Keys → Create** (permiso *Sending access*). La llave va en `RESEND_API_KEY`.
2. Configura el remitente:
   - **Sin dominio propio:** usa `onboarding@resend.dev`. Solo puede enviar al correo de la cuenta de Resend, lo cual sirve para desarrollo.
   - **Con dominio propio:** ve a **Domains → Add domain**, agrega los registros DNS y define `MAIL_FROM="Nómina Riwi <nomina@tu-dominio.com>"`.

## 4. Render (API) — T-18

1. En https://render.com, ve a **New → Blueprint** y conecta el repositorio `DylanSrz/FinancieraRiwi`. Render detecta `backend/render.yaml`.
2. Completa las variables marcadas como `sync: false`:
   - `FRONTEND_URL`
   - `DATABASE_URL`, `DIRECT_URL`
   - `GOOGLE_*`
   - `RESEND_API_KEY`, `MAIL_FROM`

   `JWT_ACCESS_SECRET` y `CRON_SECRET` se generan solos. **Copia `CRON_SECRET`** para usarlo en el SQL de pg_cron.
3. Despliega y verifica `https://financiera-riwi-api.onrender.com/api/health`.

## 5. Vercel (frontend) — T-19

1. En https://vercel.com, ve a **Add New → Project**, importa el repositorio y define **Root Directory** = `frontend`.
2. Agrega la variable de entorno `VITE_API_URL=/api`.
3. Si la URL de Render es distinta, actualiza `destination` en `frontend/vercel.json`.
4. Despliega. Luego actualiza `FRONTEND_URL` en Render y las URIs de Google con el dominio final.

## Checklist final

- [ ] `GET https://<vercel>/api/health` responde `{"status":"ok"}` (pasa por el rewrite).
- [ ] Inicio de sesión con el administrador del seed.
- [ ] Login con Google con un correo invitado.
- [ ] Un correo de invitación llega a su destino.
- [ ] `select * from cron.job_run_details order by start_time desc limit 1;` muestra la ejecución diaria.
