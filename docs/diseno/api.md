# API REST

- **URL base:** `/api`.
- **Documentación interactiva:** Swagger en `/api/docs`, fuera de producción.
- **Autenticación:** `Authorization: Bearer <accessToken>`. Todos los endpoints la exigen, salvo los marcados como 🌐 públicos.
- **Errores:** todos siguen el mismo formato.

```json
{ "statusCode": 400, "message": ["edad must not be less than 18"], "error": "Bad Request" }
```

| Código | Uso |
|---|---|
| 200 / 201 / 202 / 204 | Éxito |
| 400 | Validación de DTO fallida |
| 401 | Sin token, token vencido o secreto del cron inválido |
| 403 | Rol sin permiso |
| 404 | Recurso inexistente o de otra empresa |
| 409 | Conflicto: email duplicado, periodo cerrado |
| 429 | Demasiadas peticiones |
| 501 | Endpoint definido pero aún no implementado (Sprint 0) |

## Autenticación — `auth` (E1)

| Método | Ruta | Acceso | Descripción | HU |
|---|---|---|---|---|
| POST | `/auth/login` | 🌐 | Inicia sesión con correo y contraseña. Devuelve `{ accessToken }` y la cookie de refresh | HU-02 |
| GET | `/auth/google` | 🌐 | Redirige a Google | HU-03 |
| GET | `/auth/google/callback` | 🌐 | Callback de Google: crea la cookie y redirige al frontend | HU-03 |
| POST | `/auth/activar` | 🌐 | `{ token, password }`: activa una cuenta invitada | HU-01 |
| POST | `/auth/refresh` | 🌐 (cookie) | Rota el refresh token y devuelve un nuevo `accessToken` | HU-05 |
| POST | `/auth/logout` | 🔒 | Revoca el refresh token | HU-05 |
| POST | `/auth/recuperar` | 🌐 | `{ email }`: envía el enlace (siempre responde 202) | HU-04 |
| POST | `/auth/restablecer` | 🌐 | `{ token, password }` | HU-04 |
| GET | `/auth/me` | 🔒 | Usuario autenticado | — |

## Usuarios — `usuarios` (E1) · solo `ADMIN`

| Método | Ruta | Descripción | HU |
|---|---|---|---|
| GET | `/usuarios` | Lista usuarios | HU-06 |
| POST | `/usuarios/invitaciones` | `{ nombre, email, rol }`: invita al usuario | HU-01 |
| POST | `/usuarios/:id/reenviar-invitacion` | Reenvía la invitación | HU-01 |
| PATCH | `/usuarios/:id` | Cambia el rol o el estado | HU-06 |

## Colaboradores — `colaboradores` (E2)

| Método | Ruta | Descripción | HU |
|---|---|---|---|
| GET | `/colaboradores?q=&rol=&estado=&pagina=` | Lista paginada (20 por página) | HU-10 |
| POST | `/colaboradores` | Crea un colaborador | HU-09 |
| PATCH | `/colaboradores/:id` | Edita un colaborador | HU-09 |
| DELETE | `/colaboradores/:id` | Desactiva (no borra) | HU-09 |
| POST | `/colaboradores/importaciones/previsualizar` | `multipart/form-data` (`archivo`). Devuelve `{ validas, invalidas: [{ fila, errores[] }] }` | HU-07, HU-08 |
| POST | `/colaboradores/importaciones` | Confirma la importación en una transacción | HU-07 |

## Horas — `horas` (E3)

| Método | Ruta | Descripción | HU |
|---|---|---|---|
| GET | `/periodos/:periodoId/horas` | Horas del periodo | HU-11 |
| PUT | `/periodos/:periodoId/horas/:colaboradorId` | `{ horas }`: registra o actualiza | HU-11 |
| POST | `/periodos/:periodoId/horas/importaciones` | Importa un CSV `email,horas` | HU-11 |

## Liquidación — `liquidacion` (E4, E5)

| Método | Ruta | Descripción | HU |
|---|---|---|---|
| GET | `/periodos` | Periodos con su estado | HU-18 |
| POST | `/periodos/:id/liquidar` | Liquida o reliquida (manual) | HU-18 |
| POST | `/periodos/:id/cerrar` | Cierra el periodo | HU-19 |
| GET | `/periodos/:id/liquidaciones` | Detalle por colaborador | HU-23 |
| GET | `/periodos/:id/ejecuciones` | Historial de ejecuciones | HU-20 |
| POST | `/liquidaciones/ejecucion-programada` | Solo pg_cron, protegido con la cabecera `X-Cron-Secret` (no aparece en Swagger) | HU-17 |

## Parámetros — `parametros` (E6)

| Método | Ruta | Acceso | Descripción | HU |
|---|---|---|---|---|
| GET | `/parametros/legales/:anio` | 🔒 | Parámetros del año | HU-21 |
| PUT | `/parametros/legales/:anio` | `ADMIN` | Crea o actualiza los parámetros del año | HU-21 |
| GET | `/parametros/valores-hora` | 🔒 | Valores vigentes e histórico | HU-22 |
| POST | `/parametros/valores-hora` | `ADMIN` | `{ rol, valorHora, vigenteDesde }` | HU-22 |

## Reportes — `reportes` (E7)

| Método | Ruta | Descripción | HU |
|---|---|---|---|
| GET | `/periodos/:id/resumen` | Totales del periodo | HU-23 |
| GET | `/periodos/:id/exportar?formato=csv\|pdf` | Descarga del archivo | HU-24 |
| POST | `/periodos/:id/desprendibles` | Envía los desprendibles (solo con el periodo CERRADO) | HU-25 |

## Auditoría y salud

| Método | Ruta | Acceso | Descripción | HU |
|---|---|---|---|---|
| GET | `/auditoria?desde=&hasta=&usuario=&entidad=` | `ADMIN` | Consulta la auditoría | HU-20 |
| GET | `/health` | 🌐 | `{ status: "ok" }` para el health check de Render | — |
