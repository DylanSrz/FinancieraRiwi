# Documentación — FinancieraRiwi

Índice de la documentación del proyecto. La documentación vive junto al código y se actualiza en los mismos PR (ADR-003).

## 1. Requerimientos (Sprint 0)

| # | Documento | Contenido |
|---|---|---|
| 00 | [Toma inicial](requerimientos/00-toma-inicial.md) | Documento original del equipo (insumo) |
| 01 | [Visión y alcance](requerimientos/01-vision-y-alcance.md) | Problema, causa raíz, objetivos medibles, interesados, alcance |
| 02 | [Requerimientos funcionales](requerimientos/02-requerimientos-funcionales.md) | RF-01 a RF-26 con prioridad MoSCoW; formato de entradas y salidas |
| 03 | [Requerimientos no funcionales](requerimientos/03-requerimientos-no-funcionales.md) | Seguridad, exactitud, rendimiento, usabilidad, mantenibilidad |
| 04 | [Reglas de negocio](requerimientos/04-reglas-de-negocio.md) | RN-01 a RN-20, normativa 2026 y **casos de prueba con valores exactos** |
| 05 | [Historias de usuario](requerimientos/05-historias-de-usuario.md) | 26 historias con criterios de aceptación, por épica |
| 06 | [Casos de uso](requerimientos/06-casos-de-uso.md) | Actores, diagrama, especificaciones y estados del periodo |
| 07 | [Supuestos y preguntas](requerimientos/07-supuestos-y-preguntas.md) | 15 hallazgos con su supuesto por defecto y su estado |
| 08 | [Guion de entrevista](requerimientos/08-guion-entrevista.md) | Validación con el cliente |
| 09 | [Matriz de trazabilidad](requerimientos/09-matriz-trazabilidad.md) | RF ↔ RN ↔ HU ↔ issue ↔ módulo ↔ prueba |
| — | [Plantilla CSV](requerimientos/plantilla-colaboradores.csv) | Formato oficial de importación |

## 2. Diseño

- [Arquitectura](diseno/arquitectura.md): despliegue, módulos, flujo de autenticación y ejecución programada.
- [Modelo de datos](diseno/modelo-de-datos.md): ERD y restricciones.
- [API REST](diseno/api.md): endpoints por módulo.
- [Algoritmo de liquidación](diseno/algoritmo-liquidacion.md): diagramas de flujo y pseudocódigo.
- [Wireframes](diseno/wireframes.md): pantallas de baja fidelidad.

## 3. Decisiones (ADR)

| ADR | Decisión |
|---|---|
| [000](decisiones/ADR-000-plantilla.md) | Plantilla |
| [001](decisiones/ADR-001-stack-nestjs-react.md) | Stack NestJS + React con TypeScript |
| [002](decisiones/ADR-002-monorepo.md) | Monorepo `backend/` + `frontend/` |
| [003](decisiones/ADR-003-documentacion-en-el-repo.md) | Documentación como código |
| [004](decisiones/ADR-004-autenticacion.md) | Autenticación nativa + Google con JWT y refresh rotativo |
| [005](decisiones/ADR-005-mono-empresa-preparada-para-saas.md) | Una empresa en v1, preparada para multiempresa |
| [006](decisiones/ADR-006-parametros-configurables.md) | Parámetros configurables por año y con vigencia |
| [007](decisiones/ADR-007-ejecucion-programada.md) | Ejecución programada con pg_cron e idempotencia |
| [008](decisiones/ADR-008-despliegue-vercel-render-resend.md) | Vercel + Render + Supabase + Resend |

## 4. Guías

- [Configuración local](guias/configuracion-local.md)
- [Servicios externos](guias/configuracion-servicios.md): Supabase, Google, Resend, Render y Vercel.

## 5. Proceso

- [Roles y responsabilidades](proceso/roles-y-responsabilidades.md), con matriz RACI.
- [Plan de trabajo](proceso/plan-de-trabajo.md): sprints, ceremonias y riesgos.
- [Definition of Ready / Done](proceso/definicion-de-listo-y-terminado.md)
- [Flujo de trabajo en GitHub](proceso/flujo-de-trabajo-github.md): tablero, etiquetas y ciclo de vida.
- [Actas](proceso/actas/)
- [Reglas de trabajo (CONTRIBUTING)](../CONTRIBUTING.md)
