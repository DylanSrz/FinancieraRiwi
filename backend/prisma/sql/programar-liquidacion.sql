-- Disparador diario de la liquidación automática (ADR-007, HU-17, T-17).
-- Ejecutar UNA vez en el SQL Editor de Supabase, reemplazando <URL_API> y <CRON_SECRET>.
-- 00:00 UTC = 7:00 p. m. en America/Bogota (Colombia no tiene horario de verano).
-- La API decide si hoy corresponde liquidar (día 30 o último día del mes) y es idempotente.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'liquidacion-nomina-diaria',
  '0 0 * * *',
  $$
  select net.http_post(
    url     := '<URL_API>/api/liquidaciones/ejecucion-programada',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Cron-Secret', '<CRON_SECRET>'
    ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- Consultar ejecuciones del job:
--   select * from cron.job_run_details order by start_time desc limit 10;
-- Respuestas HTTP recibidas:
--   select id, status_code, created from net._http_response order by created desc limit 10;
-- Eliminar el job:
--   select cron.unschedule('liquidacion-nomina-diaria');
