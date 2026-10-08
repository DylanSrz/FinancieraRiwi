# Definition of Ready (DoR) y Definition of Done (DoD)

## Definition of Ready: una historia puede pasar a **Listo** cuando…

- [ ] Sigue el formato *Como / quiero / para* y aporta valor a un actor identificado.
- [ ] Tiene criterios de aceptación verificables (*Dado / Cuando / Entonces*) con valores concretos.
- [ ] Referencia sus reglas de negocio y su requerimiento (RF/RN).
- [ ] Está estimada en story points (≤ 5; una historia de 8 se divide).
- [ ] Tiene prioridad MoSCoW, épica, sprint y responsable en el tablero.
- [ ] Sus dependencias están resueltas o identificadas (etiqueta `bloqueado` si aplica).
- [ ] El equipo la entiende: no quedan preguntas abiertas que impidan empezar.

## Definition of Done: una historia pasa a **Hecho** cuando…

**Código**

- [ ] Cumple todos los criterios de aceptación.
- [ ] Tiene pruebas automatizadas: unitarias para la lógica y e2e para los endpoints nuevos. **El motor de liquidación no se integra sin pruebas.**
- [ ] `lint`, `format:check`, `test` y `build` pasan en CI.
- [ ] Las entradas se validan con DTOs, los endpoints tienen el rol correcto y no hay secretos en el código.
- [ ] Si cambió el modelo de datos, incluye la migración de Prisma.

**Revisión**

- [ ] El PR fue aprobado por al menos una persona distinta al autor, con las conversaciones resueltas.
- [ ] Se integró a `main` con *squash merge*.

**Documentación**

- [ ] La documentación afectada está actualizada (API, ERD, reglas).
- [ ] La [matriz de trazabilidad](../requerimientos/09-matriz-trazabilidad.md) refleja el nuevo estado.
- [ ] Si se tomó una decisión técnica relevante, quedó registrada como ADR.

**Aceptación**

- [ ] QA verificó los criterios en el entorno integrado.
- [ ] El PO la aceptó en la Sprint Review.

## Definition of Done del sprint

- [ ] Todas las historias comprometidas están en **Hecho** o se movieron explícitamente al siguiente sprint con su justificación.
- [ ] `main` despliega sin errores (a partir del Sprint 3).
- [ ] Están el acta de review y la de retrospectiva.
