# 02 · Requerimientos funcionales

Cada requerimiento funcional (RF) se implementa en la historia de usuario con el mismo número (RF-12 ↔ HU-12). Las historias detallan los criterios de aceptación en [05-historias-de-usuario.md](05-historias-de-usuario.md).

**Priorización MoSCoW:**

| Prioridad | Significado | Requerimientos |
|---|---|---|
| **Must** | Sin esto el producto no cumple su objetivo | 17 |
| **Should** | Importante; se entrega en v1 si no pone en riesgo un Must | 8 |
| **Could** | Deseable; se entrega si hay capacidad | 1 |
| **Won't** | Fuera de v1 | ver [alcance](01-vision-y-alcance.md#fuera-del-alcance-v10) |

| ID | Requerimiento | Prioridad | Épica | Historia |
|---|---|---|---|---|
| RF-01 | El sistema debe permitir al administrador invitar usuarios por correo con un rol, y al invitado activar su cuenta definiendo una contraseña mediante un enlace de un solo uso con vencimiento. | Must | E1 Autenticación y usuarios | HU-01 [#10](https://github.com/DylanSrz/FinancieraRiwi/issues/10) |
| RF-02 | El sistema debe autenticar usuarios activos con correo y contraseña, emitir un access token JWT y un refresh token, y bloquear temporalmente la cuenta tras intentos fallidos. | Must | E1 Autenticación y usuarios | HU-02 [#11](https://github.com/DylanSrz/FinancieraRiwi/issues/11) |
| RF-03 | El sistema debe permitir iniciar sesión con Google solo a correos previamente invitados. | Must | E1 Autenticación y usuarios | HU-03 [#12](https://github.com/DylanSrz/FinancieraRiwi/issues/12) |
| RF-04 | El sistema debe permitir restablecer la contraseña mediante un enlace enviado por correo, sin revelar si el correo existe. | Should | E1 Autenticación y usuarios | HU-04 [#13](https://github.com/DylanSrz/FinancieraRiwi/issues/13) |
| RF-05 | El sistema debe renovar la sesión con refresh tokens rotativos, detectar su reutilización y permitir cerrar sesión. | Must | E1 Autenticación y usuarios | HU-05 [#14](https://github.com/DylanSrz/FinancieraRiwi/issues/14) |
| RF-06 | El sistema debe permitir al administrador listar usuarios, cambiar su rol y desactivarlos, y restringir cada función según el rol. | Should | E1 Autenticación y usuarios | HU-06 [#15](https://github.com/DylanSrz/FinancieraRiwi/issues/15) |
| RF-07 | El sistema debe importar colaboradores desde un archivo CSV (nombres, apellidos, rol, email, edad, hijos) con vista previa y confirmación transaccional. | Must | E2 Gestión de colaboradores | HU-07 [#16](https://github.com/DylanSrz/FinancieraRiwi/issues/16) |
| RF-08 | El sistema debe validar cada fila del CSV e informar los errores por fila, permitiendo descargar el reporte de errores. | Must | E2 Gestión de colaboradores | HU-08 [#17](https://github.com/DylanSrz/FinancieraRiwi/issues/17) |
| RF-09 | El sistema debe permitir crear, editar y desactivar colaboradores sin borrar su histórico, registrando los cambios en auditoría. | Must | E2 Gestión de colaboradores | HU-09 [#18](https://github.com/DylanSrz/FinancieraRiwi/issues/18) |
| RF-10 | El sistema debe listar colaboradores con paginación, búsqueda por texto y filtros por rol y estado. | Must | E2 Gestión de colaboradores | HU-10 [#19](https://github.com/DylanSrz/FinancieraRiwi/issues/19) |
| RF-11 | El sistema debe registrar las horas trabajadas por colaborador y periodo, de forma manual o por CSV, validando el rango permitido. | Must | E3 Registro de horas | HU-11 [#20](https://github.com/DylanSrz/FinancieraRiwi/issues/20) |
| RF-12 | El sistema debe calcular el devengado básico como horas trabajadas × valor hora vigente del rol. | Must | E4 Motor de liquidación | HU-12 [#21](https://github.com/DylanSrz/FinancieraRiwi/issues/21) |
| RF-13 | El sistema debe sumar la bonificación por número de hijos según la tabla vigente. | Must | E4 Motor de liquidación | HU-13 [#22](https://github.com/DylanSrz/FinancieraRiwi/issues/22) |
| RF-14 | El sistema debe reconocer el auxilio de transporte a quien devengue hasta 2 SMMLV. | Must | E4 Motor de liquidación | HU-14 [#23](https://github.com/DylanSrz/FinancieraRiwi/issues/23) |
| RF-15 | El sistema debe calcular las deducciones de salud, pensión y Fondo de Solidaridad Pensional y el neto a pagar. | Must | E4 Motor de liquidación | HU-15 [#24](https://github.com/DylanSrz/FinancieraRiwi/issues/24) |
| RF-16 | El sistema debe calcular los aportes del empleador, los parafiscales (con exoneraciones de ley) y las provisiones de prestaciones sociales. | Should | E4 Motor de liquidación | HU-16 [#25](https://github.com/DylanSrz/FinancieraRiwi/issues/25) |
| RF-17 | El sistema debe ejecutar la liquidación automáticamente el día 30 de cada mes a las 7:00 p. m. (o el último día si el mes es más corto), sin duplicar resultados. | Must | E5 Ejecución programada y cierre | HU-17 [#26](https://github.com/DylanSrz/FinancieraRiwi/issues/26) |
| RF-18 | El sistema debe permitir liquidar manualmente y reliquidar un periodo no cerrado. | Must | E5 Ejecución programada y cierre | HU-18 [#27](https://github.com/DylanSrz/FinancieraRiwi/issues/27) |
| RF-19 | El sistema debe permitir cerrar un periodo calculado, dejándolo inmutable. | Should | E5 Ejecución programada y cierre | HU-19 [#28](https://github.com/DylanSrz/FinancieraRiwi/issues/28) |
| RF-20 | El sistema debe registrar y permitir consultar el historial de ejecuciones y la auditoría de acciones. | Should | E5 Ejecución programada y cierre | HU-20 [#29](https://github.com/DylanSrz/FinancieraRiwi/issues/29) |
| RF-21 | El sistema debe permitir administrar los parámetros legales por año y usar los del año del periodo en cada cálculo. | Must | E6 Parámetros de nómina | HU-21 [#30](https://github.com/DylanSrz/FinancieraRiwi/issues/30) |
| RF-22 | El sistema debe permitir configurar el valor hora por rol con fecha de vigencia. | Should | E6 Parámetros de nómina | HU-22 [#31](https://github.com/DylanSrz/FinancieraRiwi/issues/31) |
| RF-23 | El sistema debe mostrar el resumen del periodo con totales y el detalle por colaborador. | Must | E7 Reportes y notificaciones | HU-23 [#32](https://github.com/DylanSrz/FinancieraRiwi/issues/32) |
| RF-24 | El sistema debe exportar la nómina del periodo a CSV y PDF. | Should | E7 Reportes y notificaciones | HU-24 [#33](https://github.com/DylanSrz/FinancieraRiwi/issues/33) |
| RF-25 | El sistema debe enviar por correo el desprendible de pago a cada colaborador de un periodo cerrado. | Should | E7 Reportes y notificaciones | HU-25 [#34](https://github.com/DylanSrz/FinancieraRiwi/issues/34) |
| RF-26 | El sistema debe notificar por correo al auxiliar contable el resultado de cada ejecución programada. | Could | E7 Reportes y notificaciones | HU-26 [#35](https://github.com/DylanSrz/FinancieraRiwi/issues/35) |

## Entradas y salidas del sistema

**Entrada principal: CSV de colaboradores** ([plantilla](plantilla-colaboradores.csv))

| Columna | Tipo | Obligatoria | Validación |
|---|---|---|---|
| `nombres` | texto | Sí | 2 a 100 caracteres |
| `apellidos` | texto | Sí | 2 a 100 caracteres |
| `rol` | texto | Sí | `gerente`, `administrador` u `operario` (sin distinguir mayúsculas ni tildes) |
| `email` | texto | Sí | Formato válido; único por empresa y dentro del archivo |
| `edad` | entero | Sí | 18 a 100 (supuesto S-02) |
| `hijos` | entero | Sí | ≥ 0 |

Formato: UTF-8, separador coma, primera fila con encabezados y máximo 5 MB.

**Entrada complementaria: horas del periodo.** Se registran manualmente o con un CSV `email,horas` (supuesto S-01).

**Salidas:**

- Liquidación por colaborador: devengados, deducciones, neto y costo del empleador.
- Resumen del periodo.
- Exportaciones en CSV y PDF.
- Desprendible por correo.
- Correo de notificación de cada ejecución.
