# ADR-001 · Stack: NestJS + React con TypeScript

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | Todo el equipo |
| **Issue** | #44 (T-09) |

## Contexto

Necesitamos un stack que el equipo de 4 personas domine, que permita dividir el trabajo por módulos y que facilite probar el motor de liquidación. El documento inicial ya mencionaba `npm run start:dev`.

## Opciones consideradas

1. **NestJS + React (TypeScript en ambos):**
   - (+) Un solo lenguaje en todo el proyecto.
   - (+) Módulos, inyección de dependencias, guards y validación de DTOs incluidos.
   - (+) Swagger automático.
   - (−) Más estructura inicial que Express.
2. **Express + HTML/JS:**
   - (+) Simple.
   - (−) Sin estructura, validación ni tipado.
   - (−) Más difícil mantener la consistencia entre 4 personas.
3. **Spring Boot + Angular:**
   - (−) El equipo tiene menos experiencia.
   - (−) Ciclo de desarrollo más lento.

## Decisión

**Backend con NestJS 12** (TypeScript estricto, ESM, Vitest) y **frontend con React 19 + Vite + React Router**.

## Consecuencias

- **Tipos compartidos:** los nombres de dominio son los mismos en back y front.
- **Organización:** cada épica corresponde a un módulo de Nest (ver [arquitectura](../diseno/arquitectura.md)).
- **Herramientas:** Oxlint y Prettier para estilo y Vitest para pruebas, en ambos proyectos.
