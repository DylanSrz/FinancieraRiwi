# ADR-003 · Documentación como código dentro del repositorio

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | Todo el equipo |
| **Issue** | #48 (T-13) |

## Contexto

La toma de requerimientos es la primera entrega evaluada y debe mantenerse actualizada durante el desarrollo.

## Opciones consideradas

1. **Markdown en `docs/` con diagramas Mermaid:**
   - (+) Versionado junto al código.
   - (+) Se revisa en los mismos PRs.
   - (+) GitHub lo renderiza.
2. **Wiki de GitHub:**
   - (−) Sin revisión por PR.
   - (−) Se desincroniza del código.
3. **Documentos externos (Drive, Notion):**
   - (−) Fuera del flujo de trabajo y sin trazabilidad.

## Decisión

**Markdown en `docs/`**, con diagramas en Mermaid. Las decisiones técnicas se registran como ADR en `docs/decisiones/`.

## Consecuencias

- **Mismo PR:** un cambio de requerimiento o de modelo actualiza su documento y la matriz de trazabilidad en el mismo PR (regla en `CONTRIBUTING.md`).
- **Fuente de verdad:** el backlog en GitHub Projects y `05-historias-de-usuario.md` se mantienen alineados.
