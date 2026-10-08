# 08 · Guion de entrevista de validación

| | |
|---|---|
| **Objetivo** | Validar el alcance, las reglas de negocio y los supuestos con el cliente (instructor en el rol de Financiera Riwi) |
| **Duración** | 30 minutos |
| **Moderador** | Scrum Master (@Nesdael) |
| **Toma de notas** | Analista (@Kerin0011), en `docs/proceso/actas/AAAA-MM-DD-entrevista-cliente.md` |
| **Presenta** | Product Owner (@DylanSrz), con wireframes de @Gonza204658 |
| **Tarea** | T-14 |

## Agenda

| Min | Bloque | Material |
|---|---|---|
| 0–3 | Objetivo de la sesión y agenda | — |
| 3–8 | Validar el problema y los objetivos | [01-vision-y-alcance.md](01-vision-y-alcance.md) |
| 8–20 | Preguntas abiertas (prioridad alta primero) | Este guion |
| 20–26 | Recorrido rápido por los wireframes | [wireframes.md](../diseno/wireframes.md) |
| 26–30 | Resumen de acuerdos y próximos pasos | — |

## Preguntas

### Bloque 1 — Problema y objetivos (validación)

1. ¿Describimos bien el problema? ¿Cuál es el error más frecuente hoy en la liquidación?
2. ¿Cuántos colaboradores tiene hoy Financiera Riwi? ¿Cuántos esperan en un año? (para dimensionar RNF-08)
3. ¿Cómo mediría usted que el sistema funciona? ¿Le parecen bien las metas OE-1 a OE-6?

### Bloque 2 — Entradas (alta prioridad)

4. **S-01:** ¿De dónde salen las horas trabajadas? ¿Las registra contabilidad, hay un reloj de asistencia o un reporte de supervisores?
5. **S-04:** ¿La nómina se paga mensual o quincenalmente?
6. **S-02:** ¿Para qué se usa la edad del colaborador?
7. **S-06:** ¿Existen cargos distintos de gerente, administrador y operario? ¿Qué hacemos con un CSV que trae datos repetidos o inválidos?
8. **S-08:** ¿Los colaboradores deben entrar al sistema o basta con que reciban su desprendible por correo?

### Bloque 3 — Reglas de cálculo (alta prioridad)

9. **S-03:** ¿La bonificación por hijos se paga como salario o como beneficio no salarial?
10. **S-09:** Si un colaborador trabaja pocas horas y su pago queda por debajo del salario mínimo, ¿qué debe pasar?
11. **S-10:** ¿Se pagan horas extra, recargos nocturnos, dominicales o festivos?
12. **S-11:** ¿Además del neto a pagar, necesitan ver el costo total para la empresa (aportes, parafiscales y provisiones)?
13. **S-12:** ¿Qué clase de riesgo ARL tiene cada cargo?
14. Validar con el cliente los resultados de **CP-01** (operario, 168 h, 2 hijos → neto **$3.740.295**). ¿Coinciden con lo que esperaría?

### Bloque 4 — Proceso y operación

15. **S-05:** En febrero no existe el día 30. ¿Le parece bien liquidar el último día del mes?
16. **S-07:** Después del cálculo automático, ¿quién revisa y aprueba antes de pagar? Si el proceso falla, ¿a quién avisamos?
17. **S-14:** ¿Quiénes usarán el sistema y con qué rol? ¿Usan cuentas de Google corporativas?
18. **S-13:** ¿El primer entregable debe servir solo a Financiera Riwi o también a otras empresas?

### Cierre

19. De todo lo que mostramos, ¿qué es lo más importante para usted en la primera entrega?
20. ¿Hay algo que no hayamos preguntado y que deberíamos saber?

## Después de la entrevista

- [ ] Actualizar el estado de cada supuesto en [07-supuestos-y-preguntas.md](07-supuestos-y-preguntas.md): 🟢 confirmado o 🔴 cambiado.
- [ ] Ajustar las historias de usuario y las reglas de negocio afectadas, y la [matriz de trazabilidad](09-matriz-trazabilidad.md).
- [ ] Repriorizar el backlog en el Sprint Planning si algo cambió.
- [ ] Publicar el acta en `docs/proceso/actas/`.
