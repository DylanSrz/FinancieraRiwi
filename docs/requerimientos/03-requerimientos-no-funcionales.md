# 03 · Requerimientos no funcionales

Cada requerimiento no funcional (RNF) tiene un criterio verificable. La forma de verificarlo está en la [matriz de trazabilidad](09-matriz-trazabilidad.md#cobertura-de-requerimientos-no-funcionales).

## Seguridad

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| **RNF-01** | **Autenticación segura** | • Contraseñas con hash bcrypt (costo ≥ 12).<br>• Access token JWT firmado (HS256), con vida de 15 min.<br>• Refresh token opaco, guardado solo como hash, rotativo, con vida de 7 días y entregado en una cookie `httpOnly; Secure; SameSite=Strict`.<br>• Bloqueo de 15 min tras 5 intentos fallidos.<br>• Límite de 5 peticiones/min en `/auth/login` |
| **RNF-02** | **Autorización por rol** | • Todo endpoint exige JWT, salvo los marcados como públicos.<br>• Los endpoints de administración responden 403 a `AUX_CONTABLE`.<br>• Cada consulta filtra por la `empresaId` del token |
| **RNF-03** | **Protección de datos personales** (Ley 1581 de 2012) | • Solo HTTPS en producción.<br>• CORS restringido al dominio del frontend.<br>• Cabeceras de seguridad con Helmet.<br>• Sin datos personales en los logs.<br>• Los secretos solo viven en variables de entorno |
| **RNF-12** | **Validación de entradas** | • Todas las entradas se validan con DTOs (`class-validator`, `whitelist`).<br>• Archivos CSV de máximo 5 MB; solo `text/csv` |

## Exactitud y consistencia

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| **RNF-04** | **Exactitud del cálculo** | • El 100 % de los casos CP-01 a CP-12 de [04-reglas-de-negocio.md](04-reglas-de-negocio.md#casos-de-prueba) pasan al peso.<br>• Los montos se guardan en `DECIMAL(14,2)`, nunca en coma flotante |
| **RNF-05** | **Zona horaria** | • Toda regla de calendario usa `America/Bogota`.<br>• Las fechas se guardan en UTC y se muestran en hora de Colombia |
| **RNF-06** | **Idempotencia** | Ejecutar dos veces la liquidación programada del mismo periodo no crea registros duplicados (restricción única `periodo + colaborador`) |
| **RNF-07** | **Auditoría** | Se registran usuario, fecha, acción, entidad y valores antes/después de:<br>• importaciones,<br>• cambios en colaboradores, horas y parámetros,<br>• liquidaciones, reliquidaciones y cierres,<br>• cambios de usuarios.<br>La auditoría no se puede editar desde la aplicación |

## Rendimiento y disponibilidad

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| **RNF-08** | **Rendimiento** | • Importar un CSV de 1.000 filas toma < 10 s.<br>• Liquidar 500 colaboradores toma < 30 s.<br>• El 95 % de las consultas de listado responden en < 1 s |
| **RNF-09** | **Disponibilidad de la ejecución programada** | • El disparador diario (pg_cron) despierta la API aunque esté suspendida (plan gratuito de Render).<br>• Si falla, la ejecución queda registrada como FALLIDA y se notifica por correo.<br>• Health check en `GET /api/health` |

## Usabilidad y compatibilidad

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| **RNF-10** | **Usabilidad** | • Interfaz en español.<br>• Montos con formato `$ 1.234.567`.<br>• Mensajes de error que dicen qué corregir.<br>• Diseño responsive desde 360 px.<br>• Contraste WCAG AA |
| **RNF-13** | **Compatibilidad** | Últimas 2 versiones de Chrome, Edge, Firefox y Safari |

## Mantenibilidad y operación

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| **RNF-11** | **Mantenibilidad** | • TypeScript estricto.<br>• Módulos por dominio.<br>• El motor de liquidación es una función pura con pruebas unitarias.<br>• Cada PR pasa CI: lint, formato, pruebas y build.<br>• Las decisiones se registran en ADR |
| **RNF-14** | **Configurabilidad** | • Los valores legales, el valor hora y la bonificación se cambian desde la interfaz, sin desplegar.<br>• Cada valor tiene vigencia por fecha o año |
| **RNF-15** | **Despliegue** | • Despliegue continuo desde `main`: frontend en Vercel y API en Render.<br>• Las migraciones de base de datos se aplican en el build (`prisma migrate deploy`) |
| **RNF-16** | **Documentación de la API** | Swagger/OpenAPI disponible en `/api/docs` fuera de producción |
