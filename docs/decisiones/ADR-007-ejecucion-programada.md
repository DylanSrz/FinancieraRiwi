# ADR-007 · Ejecución programada con Supabase pg_cron e idempotencia

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | @DylanSrz, @Nesdael, @Kerin0011 |
| **Issue** | #44 (T-09) · HU-17, T-17 |

## Contexto

Restricción del cliente: *"Debe ejecutarse el cálculo automático cada día 30 del mes en curso a las 7:00 p. m."*

- **Render suspende el servicio:** en el plan gratuito, el web service se suspende tras 15 minutos sin tráfico. Un cron dentro de NestJS (`@nestjs/schedule`) **no se ejecutaría**.
- **Febrero:** no tiene día 30.
- **Horario de verano:** Colombia (`America/Bogota`, UTC−5) no lo usa.

## Opciones consideradas

1. **Cron interno con `@nestjs/schedule`:**
   - (−) No funciona si la API está suspendida.
   - (−) Se duplicaría si hay varias instancias.
2. **Render Cron Job:**
   - (+) Nativo.
   - (−) Es de pago.
3. **GitHub Actions `schedule`:**
   - (+) Gratis.
   - (−) Puede retrasarse decenas de minutos.
   - (−) Depende del repositorio.
4. **Supabase `pg_cron` + `pg_net`, llamando a la API:**
   - (+) Gratis y puntual.
   - (+) Corre junto a la base de datos.
   - (+) El request despierta la API.

## Decisión

**Opción 4**, con la lógica de calendario en la API:

- **Llamada diaria:** pg_cron llama todos los días a las `00:00 UTC` (= 7:00 p. m. en Bogotá) a `POST /api/liquidaciones/ejecucion-programada`, con la cabecera `X-Cron-Secret`. El SQL está en `backend/prisma/sql/programar-liquidacion.sql`.
- **Seguridad:** la API valida el secreto con una comparación en tiempo constante.
- **Calendario:** la API decide si hoy, en hora de la empresa, es **día 30** o el **último día de un mes de menos de 30 días** (RN-08, función pura `esDiaDeLiquidacion`).
- **Idempotencia (RN-17):** solo se liquida si el periodo está ABIERTO, y además existe la restricción única `liquidaciones(periodo_id, colaborador_id)`.
- **Registro y aviso:** la ejecución queda en `ejecuciones` y se notifica por correo (HU-26).

## Consecuencias

- **Arranque en frío:** si Render estaba suspendido tarda ~30–60 s en responder; el `timeout` de `pg_net` es de 60 s.
- **Monitoreo:** se revisan `cron.job_run_details`, `net._http_response` y la tabla `ejecuciones`.
- **Desarrollo local:** se prueba llamando el endpoint con `curl` y el secreto.
