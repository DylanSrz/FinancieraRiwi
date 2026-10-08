# Modelo de datos

La fuente de verdad es [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma); este documento lo explica. **Todo cambio al schema actualiza este ERD en el mismo PR.**

**Convenciones:**

- Tablas en `snake_case` plural.
- Llaves primarias UUID.
- Montos en `DECIMAL(14,2)`.
- Porcentajes en `DECIMAL(7,5)` (0,04 = 4 %).
- Fechas en UTC.
- Todo cuelga de `empresa_id`, para que el sistema sea multiempresa (ADR-005).

## Diagrama entidad-relación

```mermaid
erDiagram
    EMPRESAS ||--o{ USUARIOS : tiene
    EMPRESAS ||--o{ COLABORADORES : emplea
    EMPRESAS ||--o{ PERIODOS : liquida
    EMPRESAS ||--o{ PARAMETROS_LEGALES : configura
    EMPRESAS ||--o{ VALORES_HORA_ROL : configura
    EMPRESAS ||--o{ BONIFICACIONES_HIJOS : configura
    EMPRESAS ||--o{ AUDITORIAS : registra
    USUARIOS ||--o{ REFRESH_TOKENS : "inicia sesión"
    USUARIOS ||--o{ TOKENS_ACCION : recibe
    USUARIOS ||--o{ AUDITORIAS : realiza
    PERIODOS ||--o{ REGISTROS_HORAS : contiene
    PERIODOS ||--o{ EJECUCIONES : tiene
    PERIODOS ||--o{ LIQUIDACIONES : produce
    COLABORADORES ||--o{ REGISTROS_HORAS : trabaja
    COLABORADORES ||--o{ LIQUIDACIONES : recibe
    EJECUCIONES ||--o{ LIQUIDACIONES : genera

    EMPRESAS {
        uuid id PK
        string nombre
        string nit UK
        string zona_horaria "America/Bogota"
    }
    USUARIOS {
        uuid id PK
        uuid empresa_id FK
        string nombre
        string email UK
        string password_hash "null si solo usa Google"
        string google_id UK
        enum rol "ADMIN | AUX_CONTABLE"
        enum estado "PENDIENTE | ACTIVO | INACTIVO"
        bool email_verificado
        int intentos_fallidos
        datetime bloqueado_hasta
        datetime ultimo_acceso
    }
    REFRESH_TOKENS {
        uuid id PK
        uuid usuario_id FK
        string token_hash UK
        uuid familia "rotación y detección de reuso"
        datetime expira_en
        datetime revocado_en
    }
    TOKENS_ACCION {
        uuid id PK
        uuid usuario_id FK
        enum tipo "INVITACION | RECUPERACION"
        string token_hash UK
        datetime expira_en
        datetime usado_en
    }
    COLABORADORES {
        uuid id PK
        uuid empresa_id FK
        string nombres
        string apellidos
        string email "UK con empresa_id"
        enum rol "GERENTE | ADMINISTRADOR | OPERARIO"
        int edad
        int hijos
        int clase_riesgo_arl "1..5"
        bool activo
    }
    PERIODOS {
        uuid id PK
        uuid empresa_id FK
        int anio "UK con empresa_id y mes"
        int mes
        date fecha_corte
        enum estado "ABIERTO | CALCULADO | CERRADO"
        uuid cerrado_por_id FK
        datetime cerrado_en
    }
    REGISTROS_HORAS {
        uuid id PK
        uuid periodo_id FK "UK con colaborador_id"
        uuid colaborador_id FK
        decimal horas
        uuid registrado_por_id FK
    }
    PARAMETROS_LEGALES {
        uuid id PK
        uuid empresa_id FK
        int anio "UK con empresa_id"
        decimal smmlv
        decimal auxilio_transporte
        decimal tope_auxilio_smmlv
        decimal salud_empleado
        decimal pension_empleado
        decimal salud_empleador
        decimal pension_empleador
        decimal caja_compensacion
        decimal icbf
        decimal sena
        decimal tope_exoneracion_smmlv
        decimal horas_max_mes
        json fsp_tramos
        json arl_tarifas
    }
    VALORES_HORA_ROL {
        uuid id PK
        uuid empresa_id FK
        enum rol
        decimal valor_hora
        date vigente_desde
    }
    BONIFICACIONES_HIJOS {
        uuid id PK
        uuid empresa_id FK
        int hijos "3 = tres o más"
        decimal valor
        date vigente_desde
    }
    EJECUCIONES {
        uuid id PK
        uuid empresa_id FK
        uuid periodo_id FK
        enum origen "PROGRAMADA | MANUAL"
        enum estado "EN_CURSO | EXITOSA | CON_ADVERTENCIAS | FALLIDA"
        uuid ejecutada_por_id FK
        int total_colaboradores
        decimal total_neto
        json advertencias
        string error
    }
    LIQUIDACIONES {
        uuid id PK
        uuid periodo_id FK "UK con colaborador_id (idempotencia)"
        uuid colaborador_id FK
        uuid ejecucion_id FK
        int version
        decimal horas
        decimal valor_hora
        decimal devengado_basico
        decimal bonificacion_hijos
        decimal auxilio_transporte
        decimal total_devengado
        decimal ibc
        decimal salud_empleado
        decimal pension_empleado
        decimal fsp
        decimal neto_pagar
        decimal costo_empleador
        json parametros_usados "copia para inmutabilidad"
        json alertas
        enum estado_envio "PENDIENTE | ENVIADO | FALLIDO"
    }
    AUDITORIAS {
        uuid id PK
        uuid empresa_id FK
        uuid usuario_id FK
        string accion
        string entidad
        string entidad_id
        json antes
        json despues
        datetime created_at
    }
```

> En el diagrama, `LIQUIDACIONES` muestra solo las columnas principales. El schema también incluye las columnas de aportes del empleador, parafiscales y provisiones: `salud_empleador`, `pension_empleador`, `arl`, `caja_compensacion`, `icbf`, `sena`, `cesantias`, `intereses_cesantias`, `prima` y `vacaciones`.

## Restricciones importantes

| Restricción | Regla |
|---|---|
| `colaboradores (empresa_id, email)` único | RN-19: email único por empresa |
| `periodos (empresa_id, anio, mes)` único | Un periodo por mes |
| `registros_horas (periodo_id, colaborador_id)` único | Un registro de horas por colaborador y periodo |
| `liquidaciones (periodo_id, colaborador_id)` único | **RN-17: idempotencia**, no hay liquidaciones duplicadas |
| `parametros_legales (empresa_id, anio)` único | RN-16: un juego de parámetros por año |
| `valores_hora_rol (empresa_id, rol, vigente_desde)` único | RN-16: histórico de valores hora |
| `liquidaciones.parametros_usados` | RN-16/18: cambiar parámetros después no altera periodos ya calculados |
| Tokens (`refresh_tokens`, `tokens_accion`) | Solo se guarda el hash, nunca el token en claro |

## Datos iniciales (seed)

`npm run prisma:seed` crea:

- la empresa *Financiera Riwi*;
- los parámetros legales de 2026;
- los valores hora de los 3 roles;
- la tabla de bonificación por hijos;
- el usuario administrador (definido con `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`).

Ver [`backend/prisma/seed.ts`](../../backend/prisma/seed.ts).
