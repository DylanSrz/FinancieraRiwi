# ADR-008 · Despliegue en Vercel + Render, base de datos en Supabase y correo con Resend

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | Todo el equipo |
| **Issue** | #44 (T-09) · T-15 a T-19 |

## Contexto

Necesitamos infraestructura gratuita o de bajo costo, con despliegue continuo desde GitHub, para un proyecto formativo.

## Decisión

| Componente | Servicio | Configuración |
|---|---|---|
| Frontend | **Vercel** | Root `frontend/`, `vercel.json` con rewrites: `/api/*` → Render y el resto → `index.html` (SPA) |
| API | **Render** (web service, Node 24) | Blueprint `backend/render.yaml`, health check `/api/health`, `prisma migrate deploy` en el build |
| Base de datos | **Supabase PostgreSQL** | La app usa el pooler en modo transacción (`:6543`) y las migraciones usan la conexión directa o en modo sesión (`:5432`). Extensiones `pg_cron` y `pg_net` |
| Correo | **Resend** | Remitente verificado; sin API key en local, los correos se muestran en el log |
| Identidad | **Google Cloud OAuth 2.0** | URIs de redirección para `localhost` y el dominio de Vercel |

**Por qué el rewrite de Vercel** en lugar de llamar directo a Render:

- el navegador ve un solo origen, así que no hay CORS en producción;
- la cookie del refresh token es *first-party* y puede ser `SameSite=Strict`;
- se evita el bloqueo de cookies de terceros en Safari y Chrome.

## Consecuencias

- **Arranque en frío:** la primera petición después de un rato sin uso tarda más, por la suspensión del plan gratuito de Render.
- **URL de la API:** si cambia, hay que actualizar `vercel.json`.
- **Secretos:** se configuran en los paneles de Render y Vercel, nunca en el repositorio.
- **Paso a paso:** está en [configuracion-servicios.md](../guias/configuracion-servicios.md).
