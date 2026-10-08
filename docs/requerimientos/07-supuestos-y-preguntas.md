# 07 · Supuestos y preguntas abiertas

Al analizar el documento inicial ([00-toma-inicial.md](00-toma-inicial.md)) encontramos ambigüedades, vacíos y contradicciones. Para no bloquear el trabajo, cada una tiene un **supuesto por defecto**, que el equipo usa hasta que el cliente lo confirme o lo corrija en la entrevista de validación ([08-guion-entrevista.md](08-guion-entrevista.md), tarea T-14).

**Estados posibles:**

- 🟡 **Pendiente:** el supuesto está en uso, pero falta validarlo.
- 🟢 **Confirmado:** el cliente lo aprobó.
- 🔴 **Cambiado:** el cliente pidió otra cosa; hay que actualizar las historias.

| ID | Hallazgo | Tipo | Pregunta al cliente | Supuesto por defecto | Impacto | Estado |
|---|---|---|---|---|---|---|
| **S-01** | La fórmula usa "cantidad de horas", pero el CSV no trae horas trabajadas | Vacío | ¿De dónde salen las horas trabajadas de cada colaborador? ¿Hay un sistema de control de asistencia? | Las horas se registran por periodo, a mano o con un CSV `email,horas` (HU-11) | Alto: sin horas no hay cálculo | 🟡 |
| **S-02** | El CSV incluye **edad**, pero ninguna regla la usa | Ambigüedad | ¿Para qué se usa la edad? ¿Hay reglas por edad (aprendices, pensionados)? | Solo para validar que sea ≥ 18 años | Bajo | 🟡 |
| **S-03** | No se dice si la bonificación por hijos es salarial | Vacío legal | ¿La bonificación es constitutiva de salario? ¿Está pactada como no salarial? | **No salarial** (art. 128 CST): no suma al IBC ni a prestaciones | Medio: cambia aportes y provisiones | 🟡 |
| **S-04** | No se define la periodicidad del pago | Vacío | ¿La nómina es mensual o quincenal? | Mensual, con corte el día 30 | Alto | 🟡 |
| **S-05** | "Cada día 30" no existe en febrero | Inconsistencia | ¿Qué día se liquida en febrero? | El último día del mes (28 o 29) a las 7:00 p. m. (ADR-007) | Medio | 🟡 |
| **S-06** | No se dice qué hacer con roles distintos de los tres definidos ni con datos duplicados | Vacío | ¿Hay otros cargos? ¿Qué hacemos si el CSV trae un correo repetido o un colaborador que ya existe? | Filas con otro rol o con datos inválidos se rechazan; un colaborador existente se actualiza por email | Medio | 🟡 |
| **S-07** | No se dice quién aprueba la nómina ni qué pasa si la ejecución automática falla | Vacío | ¿Alguien revisa y aprueba antes de pagar? ¿A quién se avisa si falla? | El auxiliar contable revisa y **cierra** el periodo (HU-19). La ejecución es idempotente y el resultado se avisa por correo (HU-26) | Medio | 🟡 |
| **S-08** | El algoritmo dice "colaborador se registra", pero la entrada definida es un CSV que carga contabilidad | Contradicción | ¿Los colaboradores deben entrar al sistema a registrar o actualizar sus datos? | En v1 el colaborador **no** inicia sesión; solo recibe su desprendible por correo. El autoservicio queda para v2 | Alto en alcance | 🟡 |
| **S-09** | Con pocas horas, el pago puede quedar por debajo del salario mínimo | Riesgo legal | ¿Hay colaboradores de tiempo parcial? ¿Cómo se manejan sus aportes? | Se liquida con base en las horas y se marca con la alerta "IBC inferior al salario mínimo" para revisión manual | Medio | 🟡 |
| **S-10** | La fórmula no menciona horas extra, recargos nocturnos ni festivos | Vacío | ¿Se pagan horas extra o recargos? | Fuera de v1. Se valida un máximo de 180 h/mes (jornada de 42 h semanales) | Medio | 🟡 |
| **S-11** | El problema menciona "información de parafiscales", pero no hay reglas de parafiscales | Vacío | ¿Necesitan ver el costo total del empleador (aportes, parafiscales, provisiones) o solo el pago neto? | Se calcula el costo del empleador como "Should" (HU-16), con exoneraciones de ley | Medio | 🟡 |
| **S-12** | No se define la clase de riesgo ARL | Vacío | ¿Qué clase de riesgo tiene cada cargo? | Clase I (oficina) para todos; configurable por colaborador | Bajo | 🟡 |
| **S-13** | "Empresa que ofrece software a otras empresas", pero los requisitos describen solo a Financiera Riwi | Ambigüedad de alcance | ¿El MVP debe atender a varias empresas? | Una sola empresa en v1, con el modelo preparado para varias (`empresaId`, ADR-005) | Alto en arquitectura | 🟡 |
| **S-14** | No se define quién usa el sistema ni cómo accede | Vacío | ¿Quiénes usarán el sistema? ¿Usan cuentas de Google corporativas? | Dos roles: Administrador y Auxiliar contable. Acceso solo por invitación; correo y contraseña o Google | Medio | 🟡 |
| **S-15** | No se define qué hacer con un colaborador retirado | Vacío | ¿Qué pasa con los colaboradores que salen de la empresa? | Se desactiva y no se borra (se conserva el histórico). La liquidación de contrato está fuera de v1 | Bajo | 🟡 |

## Contradicciones y errores corregidos del documento inicial

| Documento inicial | Corrección | Dónde |
|---|---|---|
| Sección "Algoritmo" incompleta: *"1. Inicio 2. colaborador se registra 3. si rol es gerente o admin 4. Fin"* | Algoritmo completo con pseudocódigo y diagrama | [algoritmo-liquidacion.md](../diseno/algoritmo-liquidacion.md) |
| "Si es administrador…" puede confundirse con el usuario administrador del sistema | Se distingue el **rol del colaborador** (`GERENTE`, `ADMINISTRADOR`, `OPERARIO`) del **rol de usuario** (`ADMIN`, `AUX_CONTABLE`) | [Modelo de datos](../diseno/modelo-de-datos.md) |
| Las salidas no definían qué conceptos se calculan | Lista completa de conceptos de devengado, deducción y costo del empleador | [04-reglas-de-negocio.md](04-reglas-de-negocio.md) |
| No había criterios para saber si el cálculo es correcto | 12 casos de prueba con valores exactos | [04-reglas-de-negocio.md](04-reglas-de-negocio.md#casos-de-prueba) |
