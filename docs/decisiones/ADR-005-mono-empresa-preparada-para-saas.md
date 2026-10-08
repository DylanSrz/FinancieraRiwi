# ADR-005 · Una empresa en v1, modelo preparado para multiempresa

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | @DylanSrz (PO) |
| **Issue** | #44 (T-09) · supuesto S-13 |

## Contexto

RiwiTech vende el software a varias empresas, pero los requisitos de v1 solo describen a Financiera Riwi y el tiempo es corto.

## Opciones consideradas

1. **Sin concepto de empresa:**
   - (+) Más rápido.
   - (−) Para volverlo multiempresa habría que reescribir el modelo.
2. **Multiempresa completo (registro de empresas, aislamiento, planes):**
   - (−) Fuera del tiempo disponible.
3. **Entidad `Empresa` desde el inicio, con un solo registro en v1:**
   - (+) Barato hoy.
   - (+) Habilita el SaaS en v2.

## Decisión

**Opción 3.**

- Todas las entidades de negocio tienen `empresaId`.
- El JWT incluye `empresaId`.
- Todas las consultas filtran por ella.

## Consecuencias

- **Seed:** crea la empresa *Financiera Riwi*.
- **Parámetros:** los parámetros legales y las reglas de la empresa (valor hora, bonificación) son por empresa, de modo que cada cliente futuro podrá tener los suyos.
- **v2:** se agrega el registro de empresas y el rol de superadministrador.
