# Roles y responsabilidades

En todo el equipo, **todos programan y todos revisan PRs**. Los roles indican quién responde por cada área, no quién hace todo el trabajo de ella.

| Integrante | Rol principal | Responsabilidades | Foco técnico |
|---|---|---|---|
| **@DylanSrz** | **Product Owner + Tech Lead** | • Dueño del backlog: prioriza, refina y acepta historias.<br>• Representa al cliente y valida el alcance.<br>• Decide la arquitectura junto al equipo.<br>• Administra el repositorio. | Motor de liquidación (E4), cierre de periodo, gestión de usuarios |
| **@Nesdael** | **Scrum Master + QA** | • Facilita las ceremonias.<br>• Cuida el tablero y la Definition of Ready/Done.<br>• Elimina bloqueos.<br>• Diseña y ejecuta las pruebas de aceptación.<br>• Aprueba la calidad antes del cierre del sprint. | Importación CSV, horas, ejecución programada, correos |
| **@Kerin0011** | **Analista de requerimientos + BD/DevOps** | • Mantiene la documentación de requerimientos y la trazabilidad.<br>• Responde por la normativa legal y los parámetros.<br>• Diseña el modelo de datos.<br>• Configura Supabase, Render, Vercel, Resend y Google. | Autenticación (E1), parámetros (E6), auditoría |
| **@Gonza204658** | **Frontend lead + UX** | • Wireframes y diseño de las pantallas.<br>• Arquitectura del frontend.<br>• Accesibilidad y usabilidad. | Todas las pantallas, reportes y exportación |

## Matriz RACI de los entregables principales

**R** = Responsable de hacerlo · **A** = Aprueba · **C** = Consultado · **I** = Informado

| Entregable | Dylan | Nesdael | Kerin | Gonza |
|---|---|---|---|---|
| Visión, alcance y RF | A/R | C | C | I |
| RNF y reglas de negocio | A | C | R | I |
| Historias de usuario y backlog | A/R | C | C | C |
| Casos de uso, supuestos y trazabilidad | A | R | C | I |
| Modelo de datos y ADRs | A | C | R | C |
| Wireframes | A | C | I | R |
| Esqueleto del backend | R/A | C | C | I |
| Esqueleto del frontend | A | I | I | R |
| Reglas de trabajo, plantillas y CI | A | R | C | I |
| Configuración de servicios en la nube | A | I | R | C |
| Pruebas de aceptación | A | R | C | C |

## Acuerdos del equipo

1. **Daily:** se hace al inicio de cada clase, en 10 minutos. Cada uno responde: qué hice, qué haré y qué me bloquea.
2. **Bloqueos:** un bloqueo de más de 2 horas se comenta en el issue y se avisa al Scrum Master.
3. **Comunicación:** las decisiones se registran por escrito (issue, ADR o acta). Lo hablado que no queda escrito no cuenta como acordado.
4. **Revisión entre roles:** nadie aprueba su propio trabajo. El PO acepta las historias y QA valida los criterios.
