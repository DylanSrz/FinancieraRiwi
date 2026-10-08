# Reglas de trabajo

Estas reglas aplican a todo el equipo. Si algo no está aquí, se decide en la daily y se agrega a este archivo.

## 1. Todo empieza en un issue

- No se escribe código sin un issue. Se usa la plantilla que corresponda: **Historia de usuario**, **Tarea técnica**, **Bug** o **Épica**.
- Un issue pasa a la columna **Listo** solo si cumple la [Definition of Ready](docs/proceso/definicion-de-listo-y-terminado.md):
  - tiene criterios de aceptación,
  - está estimado,
  - tiene épica, sprint y responsable.
- Al empezar un issue, muévelo a **En progreso** y asígnatelo. Cada persona tiene como máximo **2 issues en progreso** a la vez.
- Si algo te bloquea, agrega la etiqueta `bloqueado` y comenta qué necesitas y de quién.

## 2. Ramas

`main` está protegida: no se hace push directo, todo entra por pull request.

| Tipo | Formato | Ejemplo |
|---|---|---|
| Historia | `feature/HU-XX-descripcion-corta` | `feature/HU-12-devengado-basico` |
| Tarea | `chore/T-XX-descripcion-corta` | `chore/T-15-supabase` |
| Bug | `fix/descripcion-corta` | `fix/redondeo-fsp` |
| Documentación | `docs/descripcion-corta` | `docs/actualizar-erd` |

Crea siempre la rama desde `main` actualizado:

```bash
git switch main && git pull
git switch -c feature/HU-12-devengado-basico
```

## 3. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) en español, en modo imperativo y con el número de issue.

```
<tipo>(<alcance>): <descripción> (#<issue>)
```

- **Tipos:** `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `style`.
- **Alcances:** `auth`, `colaboradores`, `horas`, `liquidacion`, `parametros`, `reportes`, `frontend`, `bd`, `ci`, `docs`.

Ejemplos:

```
feat(liquidacion): calcular bonificación por número de hijos (#22)
fix(colaboradores): rechazar edad menor de 18 en importación CSV (#17)
test(liquidacion): agregar casos CP-01 a CP-04 (#24)
```

Haz commits pequeños y que cada uno compile.

## 4. Pull requests

1. Antes de abrir el PR, actualiza tu rama y verifica que todo pase en local:
   ```bash
   git fetch origin && git rebase origin/main
   npm run lint && npm run format:check && npm test && npm run build   # en backend/ y/o frontend/
   ```
2. Abre el PR contra `main` usando la plantilla. Escribe `Closes #<issue>` para que el issue se cierre al integrar.
3. Mueve el issue a **En revisión**.
4. **Aprobación:** se necesita **1 aprobación de alguien distinto al autor**. Los revisores sugeridos están en `.github/CODEOWNERS`.
5. **CI en verde:** los jobs `Backend` y `Frontend` deben pasar.
6. **Conversaciones:** todas deben quedar resueltas antes de integrar.
7. **Integración:** se integra con **Squash and merge**. El título del PR sigue el mismo formato que los commits.
8. **Tamaño:** procura PRs de menos de ~400 líneas. Si una historia es grande, divídela en varios PRs.
9. **Después de integrar:** borra la rama.

### Cómo revisar

- **Corrección:** ¿cumple los criterios de aceptación? ¿Hay pruebas que lo demuestren?
- **Nómina:** en todo lo relacionado con el cálculo, verifica los valores contra [04-reglas-de-negocio.md](docs/requerimientos/04-reglas-de-negocio.md).
- **Seguridad:** que no haya secretos en el código, que las entradas se validen y que los endpoints tengan el rol correcto.
- **Comentarios:** deben ser concretos y amables. Usa `sugerencia:` para lo opcional y `bloqueante:` para lo obligatorio.
- **Tiempo de respuesta:** la meta es revisar en menos de 24 horas.

## 5. Calidad

- **Motor de liquidación** (`backend/src/liquidacion/domain`): necesita pruebas unitarias para cada regla de negocio. Sin pruebas no se integra.
- **DTOs:** los del backend llevan validaciones con `class-validator`.
- **Base de datos:** todo cambio en el modelo de datos va con su migración de Prisma (`npm run prisma:migrate -- --name <nombre>`) y con el ERD actualizado en `docs/diseno/modelo-de-datos.md`.
- **Variables de entorno:** cada variable nueva se agrega al `.env.example` del proyecto que corresponda y a la validación en `backend/src/config/env.validation.ts`.

## 6. Secretos

- Nunca se suben archivos `.env`, llaves de API ni contraseñas. Solo se versionan los `.env.example`.
- Si un secreto llega a subirse por error, avisa en el canal del equipo, rota la llave de inmediato y luego límpialo del historial.

## 7. Documentación

- Las decisiones técnicas importantes se registran como ADR en `docs/decisiones/`, usando la plantilla `ADR-000-plantilla.md`.
- Si cambia un requerimiento o una regla de negocio, se actualizan `docs/requerimientos/` y la [matriz de trazabilidad](docs/requerimientos/09-matriz-trazabilidad.md) en el mismo PR.
- Cada sesión de clase deja un acta en `docs/proceso/actas/AAAA-MM-DD.md`.
