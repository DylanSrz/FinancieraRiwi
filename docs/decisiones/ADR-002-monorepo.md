# ADR-002 · Monorepo con `backend/` y `frontend/`

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | Todo el equipo |
| **Issue** | #44 (T-09) |

## Contexto

Queremos un solo tablero, un solo historial y PRs que puedan tocar API e interfaz a la vez cuando una historia lo requiera.

## Opciones consideradas

1. **Un repositorio con dos proyectos independientes (`backend/`, `frontend/`)**, cada uno con su `package.json`:
   - (+) Simple.
   - (+) Render y Vercel permiten elegir un *root directory*.
2. **Monorepo con workspaces (npm, pnpm o Turborepo):**
   - (+) Dependencias compartidas.
   - (−) Más configuración de la que necesitamos.
3. **Dos repositorios:**
   - (−) Los issues, PRs y la documentación quedan separados.

## Decisión

**Un repositorio con dos proyectos independientes**, sin workspaces.

## Consecuencias

- **CI:** tiene dos jobs, `Backend` y `Frontend`.
- **Despliegue:** Render usa `rootDir: backend` y Vercel el directorio raíz `frontend`.
- **Documentación:** toda la documentación vive en `docs/`, junto al código (ADR-003).
