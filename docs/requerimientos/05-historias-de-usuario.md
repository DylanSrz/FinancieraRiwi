# 05 · Historias de usuario

Backlog del producto, organizado por épica. Cada historia es un issue del tablero, sub-issue de su épica; la columna **Issue** enlaza al issue en GitHub.

- **Formato:** *Como \<rol\>, quiero \<acción\>, para \<beneficio\>*.
- **Criterios de aceptación:** se escriben como *Dado / Cuando / Entonces*, con valores concretos.
- **Estimación:** story points en Fibonacci (1, 2, 3, 5, 8).
- **Prioridad:** MoSCoW.

## Resumen del backlog

| Historia | Título | Épica | Prioridad | Pts | Sprint | Responsable | Issue |
|---|---|---|---|---|---|---|---|
| [HU-01](#hu-01) | Invitar usuario y activar cuenta por correo | E1 | Must | 5 | Sprint 1 | @Kerin0011 | [#10](https://github.com/DylanSrz/FinancieraRiwi/issues/10) |
| [HU-02](#hu-02) | Iniciar sesión con correo y contraseña | E1 | Must | 3 | Sprint 1 | @Kerin0011 | [#11](https://github.com/DylanSrz/FinancieraRiwi/issues/11) |
| [HU-03](#hu-03) | Iniciar sesión con Google | E1 | Must | 5 | Sprint 1 | @Kerin0011 | [#12](https://github.com/DylanSrz/FinancieraRiwi/issues/12) |
| [HU-04](#hu-04) | Recuperar contraseña | E1 | Should | 3 | Sprint 2 | @Kerin0011 | [#13](https://github.com/DylanSrz/FinancieraRiwi/issues/13) |
| [HU-05](#hu-05) | Mantener y cerrar la sesión de forma segura | E1 | Must | 3 | Sprint 1 | @Kerin0011 | [#14](https://github.com/DylanSrz/FinancieraRiwi/issues/14) |
| [HU-06](#hu-06) | Gestionar usuarios y roles | E1 | Should | 3 | Sprint 1 | @DylanSrz | [#15](https://github.com/DylanSrz/FinancieraRiwi/issues/15) |
| [HU-07](#hu-07) | Importar colaboradores desde CSV | E2 | Must | 5 | Sprint 1 | @Nesdael | [#16](https://github.com/DylanSrz/FinancieraRiwi/issues/16) |
| [HU-08](#hu-08) | Validar el CSV y ver errores por fila | E2 | Must | 3 | Sprint 1 | @Nesdael | [#17](https://github.com/DylanSrz/FinancieraRiwi/issues/17) |
| [HU-09](#hu-09) | Crear y editar un colaborador | E2 | Must | 3 | Sprint 1 | @Gonza204658 | [#18](https://github.com/DylanSrz/FinancieraRiwi/issues/18) |
| [HU-10](#hu-10) | Listar y buscar colaboradores | E2 | Must | 2 | Sprint 1 | @Gonza204658 | [#19](https://github.com/DylanSrz/FinancieraRiwi/issues/19) |
| [HU-11](#hu-11) | Registrar o importar las horas del periodo | E3 | Must | 5 | Sprint 2 | @Nesdael | [#20](https://github.com/DylanSrz/FinancieraRiwi/issues/20) |
| [HU-12](#hu-12) | Calcular el devengado básico por horas | E4 | Must | 3 | Sprint 1 | @DylanSrz | [#21](https://github.com/DylanSrz/FinancieraRiwi/issues/21) |
| [HU-13](#hu-13) | Aplicar la bonificación por hijos | E4 | Must | 2 | Sprint 1 | @DylanSrz | [#22](https://github.com/DylanSrz/FinancieraRiwi/issues/22) |
| [HU-14](#hu-14) | Reconocer el auxilio de transporte | E4 | Must | 2 | Sprint 1 | @DylanSrz | [#23](https://github.com/DylanSrz/FinancieraRiwi/issues/23) |
| [HU-15](#hu-15) | Descontar salud, pensión y Fondo de Solidaridad Pensional | E4 | Must | 3 | Sprint 1 | @DylanSrz | [#24](https://github.com/DylanSrz/FinancieraRiwi/issues/24) |
| [HU-16](#hu-16) | Calcular aportes del empleador, parafiscales y provisiones | E4 | Should | 5 | Sprint 2 | @DylanSrz | [#25](https://github.com/DylanSrz/FinancieraRiwi/issues/25) |
| [HU-17](#hu-17) | Ejecutar la liquidación automáticamente el día 30 a las 7:00 p. m. | E5 | Must | 5 | Sprint 2 | @Nesdael | [#26](https://github.com/DylanSrz/FinancieraRiwi/issues/26) |
| [HU-18](#hu-18) | Liquidar manualmente o reliquidar antes del cierre | E5 | Must | 3 | Sprint 2 | @Nesdael | [#27](https://github.com/DylanSrz/FinancieraRiwi/issues/27) |
| [HU-19](#hu-19) | Cerrar (aprobar) el periodo de nómina | E5 | Should | 2 | Sprint 2 | @DylanSrz | [#28](https://github.com/DylanSrz/FinancieraRiwi/issues/28) |
| [HU-20](#hu-20) | Consultar historial de ejecuciones y auditoría | E5 | Should | 3 | Sprint 2 | @Kerin0011 | [#29](https://github.com/DylanSrz/FinancieraRiwi/issues/29) |
| [HU-21](#hu-21) | Administrar los parámetros legales por año | E6 | Must | 3 | Sprint 1 | @Kerin0011 | [#30](https://github.com/DylanSrz/FinancieraRiwi/issues/30) |
| [HU-22](#hu-22) | Configurar el valor hora por rol | E6 | Should | 2 | Sprint 1 | @Kerin0011 | [#31](https://github.com/DylanSrz/FinancieraRiwi/issues/31) |
| [HU-23](#hu-23) | Ver el resumen de nómina del periodo | E7 | Must | 3 | Sprint 2 | @Gonza204658 | [#32](https://github.com/DylanSrz/FinancieraRiwi/issues/32) |
| [HU-24](#hu-24) | Exportar la nómina a CSV y PDF | E7 | Should | 3 | Sprint 3 | @Gonza204658 | [#33](https://github.com/DylanSrz/FinancieraRiwi/issues/33) |
| [HU-25](#hu-25) | Enviar el desprendible de pago a cada colaborador | E7 | Should | 3 | Sprint 2 | @Nesdael | [#34](https://github.com/DylanSrz/FinancieraRiwi/issues/34) |
| [HU-26](#hu-26) | Notificar al auxiliar contable el resultado de la ejecución | E7 | Could | 2 | Sprint 2 | @Nesdael | [#35](https://github.com/DylanSrz/FinancieraRiwi/issues/35) |

**Total:** 26 historias · 84 puntos · Sprint 1: 47 pts · Sprint 2: 34 pts · Sprint 3: 3 pts

---

## E1 · Autenticación y usuarios [#2](https://github.com/DylanSrz/FinancieraRiwi/issues/2)

**Objetivo:** Acceso seguro a la plataforma con cuenta propia (email + contraseña) o Google, sesiones con JWT y gestión de usuarios por rol.

**Criterio de éxito:** Solo usuarios autorizados acceden y cada rol ve únicamente lo que le corresponde.

### HU-01

**Invitar usuario y activar cuenta por correo** · [#10](https://github.com/DylanSrz/FinancieraRiwi/issues/10)

> **Como** administrador, **quiero** invitar a un usuario con su correo y rol para que active su cuenta definiendo su contraseña, **para** que solo personas autorizadas tengan acceso a la información de nómina.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 5 | Sprint 1 | @Kerin0011 | RF-01 | RN-20 |

**Criterios de aceptación**

1. Dado que soy administrador, cuando invito a `aux@financiera.com` con rol AUX_CONTABLE, entonces se crea el usuario en estado PENDIENTE y se envía un correo de invitación (Resend) con un enlace válido por 48 horas.
2. Dado un enlace de invitación vigente, cuando el usuario define una contraseña que cumple la política (mínimo 8 caracteres, una mayúscula, un número), entonces la cuenta pasa a ACTIVA y el correo queda verificado.
3. Dado un enlace vencido o ya usado, cuando el usuario intenta activarlo, entonces ve el mensaje "El enlace no es válido o ha expirado" y el administrador puede reenviar la invitación.
4. Dado que el correo ya pertenece a un usuario, cuando se invita de nuevo, entonces el sistema rechaza la invitación con un mensaje claro.

### HU-02

**Iniciar sesión con correo y contraseña** · [#11](https://github.com/DylanSrz/FinancieraRiwi/issues/11)

> **Como** usuario de la plataforma, **quiero** iniciar sesión con mi correo y contraseña, **para** acceder a las funciones que mi rol permite.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @Kerin0011 | RF-02 | RN-20 |

**Criterios de aceptación**

1. Dado un usuario ACTIVO, cuando ingresa credenciales correctas, entonces recibe un access token JWT (15 min) y un refresh token (7 días) y es redirigido al panel.
2. Dadas credenciales incorrectas, cuando intenta ingresar, entonces ve "Correo o contraseña incorrectos" sin revelar cuál de los dos falló.
3. Dados 5 intentos fallidos en 15 minutos, cuando intenta de nuevo, entonces la cuenta se bloquea temporalmente 15 minutos.
4. Dado un usuario PENDIENTE o INACTIVO, cuando intenta ingresar, entonces el acceso es rechazado.

### HU-03

**Iniciar sesión con Google** · [#12](https://github.com/DylanSrz/FinancieraRiwi/issues/12)

> **Como** usuario de la plataforma, **quiero** iniciar sesión con mi cuenta de Google, **para** no tener que recordar otra contraseña.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 5 | Sprint 1 | @Kerin0011 | RF-03 | RN-20 |

**Criterios de aceptación**

1. Dado un usuario invitado cuyo correo coincide con su cuenta de Google, cuando elige "Continuar con Google", entonces inicia sesión y recibe sus tokens JWT.
2. Dado un correo de Google que no fue invitado, cuando intenta ingresar, entonces el acceso es rechazado con "Tu cuenta no tiene acceso a la plataforma".
3. Dado un usuario PENDIENTE que entra con Google, cuando la autenticación es exitosa, entonces la cuenta pasa a ACTIVA (Google ya verificó el correo).

### HU-04

**Recuperar contraseña** · [#13](https://github.com/DylanSrz/FinancieraRiwi/issues/13)

> **Como** usuario de la plataforma, **quiero** restablecer mi contraseña desde un enlace enviado a mi correo, **para** recuperar el acceso si la olvido.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 3 | Sprint 2 | @Kerin0011 | RF-04 | RN-20 |

**Criterios de aceptación**

1. Dado un correo registrado, cuando solicito recuperar la contraseña, entonces recibo un enlace de un solo uso válido por 30 minutos.
2. Dado un correo no registrado, cuando lo solicito, entonces veo el mismo mensaje de confirmación (no se revela si el correo existe).
3. Dado que restablezco la contraseña, cuando el cambio es exitoso, entonces se invalidan todos mis refresh tokens activos.

### HU-05

**Mantener y cerrar la sesión de forma segura** · [#14](https://github.com/DylanSrz/FinancieraRiwi/issues/14)

> **Como** usuario de la plataforma, **quiero** que mi sesión se renueve sola mientras trabajo y poder cerrarla, **para** trabajar sin interrupciones y proteger mi cuenta en equipos compartidos.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @Kerin0011 | RF-05 | RN-20 |

**Criterios de aceptación**

1. Dado un access token vencido y un refresh token válido, cuando la app llama a `/auth/refresh`, entonces recibe un nuevo par de tokens y el refresh anterior queda revocado (rotación).
2. Dado un refresh token revocado que se reutiliza, cuando se usa, entonces se revocan todas las sesiones del usuario.
3. Dado que cierro sesión, cuando confirmo, entonces el refresh token se revoca y vuelvo a la pantalla de inicio de sesión.

### HU-06

**Gestionar usuarios y roles** · [#15](https://github.com/DylanSrz/FinancieraRiwi/issues/15)

> **Como** administrador, **quiero** listar usuarios, cambiar su rol y desactivarlos, **para** controlar quién accede a la nómina.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 3 | Sprint 1 | @DylanSrz | RF-06 | RN-20 |

**Criterios de aceptación**

1. Dado que soy administrador, cuando abro Usuarios, entonces veo nombre, correo, rol, estado y último acceso.
2. Dado un usuario activo, cuando lo desactivo, entonces no puede iniciar sesión y sus refresh tokens se revocan.
3. Dado que soy AUX_CONTABLE, cuando intento acceder a Usuarios, entonces recibo 403.
4. Dado que soy el único administrador, cuando intento quitarme el rol, entonces el sistema lo impide.

---

## E2 · Gestión de colaboradores [#3](https://github.com/DylanSrz/FinancieraRiwi/issues/3)

**Objetivo:** Cargar y mantener la información de los colaboradores (CSV o manual) con validaciones que eviten datos inconsistentes.

**Criterio de éxito:** El 100 % de los colaboradores activos tiene datos válidos antes de liquidar.

### HU-07

**Importar colaboradores desde CSV** · [#16](https://github.com/DylanSrz/FinancieraRiwi/issues/16)

> **Como** auxiliar contable, **quiero** cargar un archivo CSV con nombres, apellidos, rol, email, edad e hijos, **para** registrar a todos los colaboradores sin digitarlos uno por uno.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 5 | Sprint 1 | @Nesdael | RF-07 | RN-19 |

**Criterios de aceptación**

1. Dado un CSV con el formato de `plantilla-colaboradores.csv` (UTF-8, separador coma, con encabezados), cuando lo cargo, entonces veo una vista previa con el número de filas válidas e inválidas antes de confirmar.
2. Dado que confirmo la importación, cuando hay filas válidas, entonces se crean los colaboradores nuevos y se actualizan los existentes (por email), en una sola transacción.
3. Dado un archivo de más de 5 MB o que no es CSV, cuando lo cargo, entonces se rechaza con un mensaje claro.
4. Dado que termina la importación, entonces se registra en auditoría quién importó, cuándo y cuántas filas se crearon/actualizaron/rechazaron.

### HU-08

**Validar el CSV y ver errores por fila** · [#17](https://github.com/DylanSrz/FinancieraRiwi/issues/17)

> **Como** auxiliar contable, **quiero** ver exactamente qué filas del CSV tienen errores y por qué, **para** corregir el archivo sin adivinar.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @Nesdael | RF-08 | RN-19 |

**Criterios de aceptación**

1. Dada una fila con rol distinto de gerente, administrador u operario, entonces se marca "Rol no válido".
2. Dada una fila con edad menor de 18 o no numérica, entonces se marca "Edad no válida".
3. Dada una fila con hijos negativo o no entero, entonces se marca "Número de hijos no válido".
4. Dada una fila con email mal formado o repetido dentro del mismo archivo, entonces se marca con el error correspondiente.
5. Dado el reporte de errores, cuando lo descargo, entonces obtengo un CSV con las filas inválidas y una columna `errores`.

### HU-09

**Crear y editar un colaborador** · [#18](https://github.com/DylanSrz/FinancieraRiwi/issues/18)

> **Como** auxiliar contable, **quiero** crear, editar o desactivar un colaborador desde un formulario, **para** mantener los datos al día cuando cambian (p. ej. nace un hijo o hay un ascenso).

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @Gonza204658 | RF-09 | RN-19 |

**Criterios de aceptación**

1. Dado el formulario, cuando guardo datos válidos, entonces el colaborador se crea o actualiza con las mismas validaciones del CSV.
2. Dado un colaborador con liquidaciones, cuando lo desactivo, entonces no se elimina (se conserva el histórico) y no se incluye en próximas liquidaciones.
3. Dado un cambio de rol o de hijos, cuando se guarda, entonces queda registrado en auditoría con el valor anterior y el nuevo.

### HU-10

**Listar y buscar colaboradores** · [#19](https://github.com/DylanSrz/FinancieraRiwi/issues/19)

> **Como** auxiliar contable, **quiero** ver la lista de colaboradores con filtros y búsqueda, **para** encontrar rápidamente a una persona.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 2 | Sprint 1 | @Gonza204658 | RF-10 | — |

**Criterios de aceptación**

1. Dada la lista, entonces se muestra paginada (20 por página) con nombre, rol, email, hijos y estado.
2. Dado un texto de búsqueda, cuando escribo, entonces se filtra por nombre, apellido o email.
3. Dado el filtro de rol o estado, cuando lo aplico, entonces la lista se actualiza.

---

## E3 · Registro de horas [#4](https://github.com/DylanSrz/FinancieraRiwi/issues/4)

**Objetivo:** Registrar las horas trabajadas por colaborador y periodo, insumo obligatorio del cálculo.

**Criterio de éxito:** Cada colaborador activo tiene horas registradas y válidas para el periodo a liquidar.

### HU-11

**Registrar o importar las horas del periodo** · [#20](https://github.com/DylanSrz/FinancieraRiwi/issues/20)

> **Como** auxiliar contable, **quiero** registrar las horas trabajadas de cada colaborador en el periodo, manualmente o por CSV, **para** que el cálculo use las horas reales.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 5 | Sprint 2 | @Nesdael | RF-11 | RN-15, RN-18 |

**Criterios de aceptación**

1. Dado un periodo abierto, cuando registro horas para un colaborador activo, entonces se guardan asociadas a ese periodo.
2. Dado un valor de horas negativo o mayor al máximo ordinario mensual (parámetro, 180 h en 2026), entonces se rechaza con "Horas fuera del rango permitido".
3. Dado un CSV `email,horas`, cuando lo importo, entonces se aplican las mismas validaciones y el reporte de errores por fila de HU-08.
4. Dado un periodo CERRADO, cuando intento modificar horas, entonces el sistema lo impide.

---

## E4 · Motor de liquidación [#5](https://github.com/DylanSrz/FinancieraRiwi/issues/5)

**Objetivo:** Calcular la nómina aplicando las reglas de negocio de la empresa y la normativa laboral colombiana vigente.

**Criterio de éxito:** Los cálculos coinciden al peso con los casos de prueba de docs/requerimientos/04-reglas-de-negocio.md.

### HU-12

**Calcular el devengado básico por horas** · [#21](https://github.com/DylanSrz/FinancieraRiwi/issues/21)

> **Como** auxiliar contable, **quiero** que el sistema calcule el salario de cada colaborador como horas × valor hora de su rol, **para** eliminar los errores de cálculo manual.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @DylanSrz | RF-12 | RN-01, RN-02, RN-03, RN-07 |

**Criterios de aceptación**

1. Dado un operario con 168 horas, cuando se liquida, entonces el devengado básico es $3.360.000.
2. Dado un gerente con 160 horas, cuando se liquida, entonces el devengado básico es $8.000.000.
3. Dado un administrador con 180 horas, cuando se liquida, entonces el devengado básico es $6.300.000.
4. Dado que el valor hora del rol cambió durante el año, cuando se liquida, entonces se usa el valor vigente en la fecha de corte del periodo.

### HU-13

**Aplicar la bonificación por hijos** · [#22](https://github.com/DylanSrz/FinancieraRiwi/issues/22)

> **Como** auxiliar contable, **quiero** que se sume automáticamente la bonificación según el número de hijos, **para** no olvidar ni equivocarme en este beneficio.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 2 | Sprint 1 | @DylanSrz | RF-13 | RN-04, RN-05, RN-06, RN-07 |

**Criterios de aceptación**

1. Dado un colaborador con 0 hijos, entonces la bonificación es $0.
2. Dado 1 hijo, entonces $200.000; 2 hijos, $400.000; 3 hijos, $600.000.
3. Dado 5 hijos, entonces la bonificación es $600.000 (tope de 3 o más).
4. Dada la bonificación, entonces no forma parte de la base de aportes (no constitutiva de salario, supuesto S-03).

### HU-14

**Reconocer el auxilio de transporte** · [#23](https://github.com/DylanSrz/FinancieraRiwi/issues/23)

> **Como** auxiliar contable, **quiero** que se pague el auxilio de transporte a quien tenga derecho, **para** cumplir la ley sin revisar caso por caso.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 2 | Sprint 1 | @DylanSrz | RF-14 | RN-09 |

**Criterios de aceptación**

1. Dado un operario con devengado básico $3.360.000 (≤ 2 SMMLV = $3.501.810), entonces recibe auxilio de transporte de $249.095.
2. Dado un gerente con devengado básico $8.000.000, entonces no recibe auxilio.
3. Dado un devengado básico exactamente igual a 2 SMMLV, entonces sí recibe auxilio.
4. Dado que el auxilio se paga, entonces no forma parte de la base de salud y pensión.

### HU-15

**Descontar salud, pensión y Fondo de Solidaridad Pensional** · [#24](https://github.com/DylanSrz/FinancieraRiwi/issues/24)

> **Como** auxiliar contable, **quiero** que se calculen las deducciones de ley del colaborador, **para** pagar el neto correcto.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @DylanSrz | RF-15 | RN-10, RN-11, RN-12, RN-13 |

**Criterios de aceptación**

1. Dado un IBC de $3.360.000, entonces salud = $134.400, pensión = $134.400, FSP = $0 y neto = $3.740.295 (con bonificación de 2 hijos y auxilio).
2. Dado un IBC de $8.000.000 (≥ 4 SMMLV), entonces FSP = 1 % = $80.000 y neto = $7.280.000.
3. Dado un IBC menor a 1 SMMLV, entonces la liquidación se marca con la alerta "IBC inferior al salario mínimo" (supuesto S-09).
4. Dado cualquier valor calculado, entonces se redondea al peso más cercano por concepto.

### HU-16

**Calcular aportes del empleador, parafiscales y provisiones** · [#25](https://github.com/DylanSrz/FinancieraRiwi/issues/25)

> **Como** auxiliar contable, **quiero** ver el costo total de cada colaborador para la empresa, **para** tener al día los parafiscales sin depender de cálculos manuales.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 5 | Sprint 2 | @DylanSrz | RF-16 | RN-14 |

**Criterios de aceptación**

1. Dado un operario con IBC $3.360.000, entonces pensión empleador = $403.200, ARL (clase I) = $17.539, caja = $134.400, salud/ICBF/SENA = $0 por exoneración.
2. Dado el mismo operario, entonces provisiones: cesantías = $300.758, intereses = $36.091, prima = $300.758, vacaciones = $140.000.
3. Dado un IBC ≥ 10 SMMLV, entonces no aplica la exoneración y se calculan salud 8,5 %, ICBF 3 % y SENA 2 %.

---

## E5 · Ejecución programada y cierre [#6](https://github.com/DylanSrz/FinancieraRiwi/issues/6)

**Objetivo:** Ejecutar la liquidación automáticamente el día 30 a las 7:00 p. m., permitir reliquidar y cerrar el periodo con trazabilidad.

**Criterio de éxito:** La liquidación se ejecuta sin intervención humana, sin duplicados y queda auditada.

### HU-17

**Ejecutar la liquidación automáticamente el día 30 a las 7:00 p. m.** · [#26](https://github.com/DylanSrz/FinancieraRiwi/issues/26)

> **Como** auxiliar contable, **quiero** que la liquidación del mes se ejecute sola el día 30 a las 7:00 p. m., **para** cumplir el calendario de pago sin depender de que alguien lo recuerde.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 5 | Sprint 2 | @Nesdael | RF-17 | RN-08, RN-17 |

**Criterios de aceptación**

1. Dado el día 30 de un mes a las 7:00 p. m. (America/Bogota), cuando el disparador programado llama a la API, entonces se liquida a todos los colaboradores activos con horas registradas.
2. Dado febrero (28 o 29 días), cuando es el último día del mes a las 7:00 p. m., entonces se ejecuta la liquidación.
3. Dado que la ejecución del periodo ya se realizó, cuando el disparador se repite, entonces no se duplica ninguna liquidación (idempotencia).
4. Dada una llamada sin el secreto `X-Cron-Secret` correcto, entonces la API responde 401.
5. Dados colaboradores sin horas registradas, entonces se omiten y quedan listados como advertencia en la ejecución.

### HU-18

**Liquidar manualmente o reliquidar antes del cierre** · [#27](https://github.com/DylanSrz/FinancieraRiwi/issues/27)

> **Como** auxiliar contable, **quiero** ejecutar la liquidación cuando lo necesite y volver a calcularla si corrijo datos, **para** corregir errores antes de pagar.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 2 | @Nesdael | RF-18 | RN-17, RN-18 |

**Criterios de aceptación**

1. Dado un periodo ABIERTO, cuando ejecuto "Liquidar ahora", entonces se calcula la nómina y queda en estado CALCULADA.
2. Dado un periodo CALCULADO, cuando corrijo horas o datos y reliquido, entonces se reemplazan los valores anteriores y se registra la versión en auditoría.
3. Dado un periodo CERRADO, cuando intento reliquidar, entonces el sistema lo impide.

### HU-19

**Cerrar (aprobar) el periodo de nómina** · [#28](https://github.com/DylanSrz/FinancieraRiwi/issues/28)

> **Como** auxiliar contable, **quiero** cerrar el periodo cuando reviso que todo está correcto, **para** que nadie modifique una nómina ya aprobada.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 2 | Sprint 2 | @DylanSrz | RF-19 | RN-18 |

**Criterios de aceptación**

1. Dado un periodo CALCULADO, cuando lo cierro, entonces pasa a CERRADO, se registra quién y cuándo, y se habilita el envío de desprendibles.
2. Dado un periodo con liquidaciones con alertas, cuando intento cerrarlo, entonces debo confirmar explícitamente que revisé las alertas.

### HU-20

**Consultar historial de ejecuciones y auditoría** · [#29](https://github.com/DylanSrz/FinancieraRiwi/issues/29)

> **Como** administrador, **quiero** ver el historial de ejecuciones y cambios relevantes, **para** tener trazabilidad ante cualquier reclamo.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 3 | Sprint 2 | @Kerin0011 | RF-20 | RN-17 |

**Criterios de aceptación**

1. Dada la vista de ejecuciones, entonces veo fecha, origen (PROGRAMADA/MANUAL), periodo, estado, total liquidado, número de colaboradores y errores.
2. Dada la auditoría, entonces veo quién hizo qué acción, cuándo y sobre qué entidad, filtrable por fecha y usuario.

---

## E6 · Parámetros de nómina [#7](https://github.com/DylanSrz/FinancieraRiwi/issues/7)

**Objetivo:** Mantener actualizados los valores legales por año y los valores hora por rol sin tocar código.

**Criterio de éxito:** Actualizar el SMMLV o un porcentaje toma menos de 1 minuto y no requiere despliegue.

### HU-21

**Administrar los parámetros legales por año** · [#30](https://github.com/DylanSrz/FinancieraRiwi/issues/30)

> **Como** administrador, **quiero** registrar los valores legales de cada año (SMMLV, auxilio, porcentajes), **para** mantener la nómina al día con la ley sin modificar el código.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 1 | @Kerin0011 | RF-21 | RN-16 |

**Criterios de aceptación**

1. Dado el año 2026, entonces el sistema trae precargados SMMLV $1.750.905, auxilio $249.095 y los porcentajes de RN-10 a RN-14.
2. Dado que registro los parámetros de 2027, cuando se liquida un periodo de 2027, entonces se usan esos valores.
3. Dado un año sin parámetros, cuando se intenta liquidar, entonces la ejecución falla con "No hay parámetros legales para el año AAAA" y se notifica.
4. Dado un periodo cerrado, entonces cambiar parámetros no altera sus valores (se guarda copia de los parámetros usados).

### HU-22

**Configurar el valor hora por rol** · [#31](https://github.com/DylanSrz/FinancieraRiwi/issues/31)

> **Como** administrador, **quiero** modificar el valor hora de cada rol con fecha de vigencia, **para** reflejar aumentos sin perder el histórico.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 2 | Sprint 1 | @Kerin0011 | RF-22 | RN-01, RN-02, RN-03, RN-16 |

**Criterios de aceptación**

1. Dada la configuración inicial, entonces gerente = $50.000, administrador = $35.000 y operario = $20.000.
2. Dado un nuevo valor con vigencia desde una fecha, cuando se liquida un periodo posterior, entonces se usa el nuevo valor; los periodos anteriores no cambian.

---

## E7 · Reportes y notificaciones [#8](https://github.com/DylanSrz/FinancieraRiwi/issues/8)

**Objetivo:** Consultar, exportar y comunicar los resultados de la nómina a contabilidad y a cada colaborador.

**Criterio de éxito:** Contabilidad obtiene el resumen del periodo y cada colaborador recibe su desprendible por correo.

### HU-23

**Ver el resumen de nómina del periodo** · [#32](https://github.com/DylanSrz/FinancieraRiwi/issues/32)

> **Como** auxiliar contable, **quiero** ver el resumen del periodo con el detalle por colaborador, **para** revisar la nómina antes de cerrarla.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Must | 3 | Sprint 2 | @Gonza204658 | RF-23 | RN-13 |

**Criterios de aceptación**

1. Dado un periodo liquidado, entonces veo totales: devengado, deducciones, neto a pagar y costo empleador.
2. Dada la tabla por colaborador, cuando abro un registro, entonces veo cada concepto (básico, bonificación, auxilio, salud, pensión, FSP, neto) y las alertas.

### HU-24

**Exportar la nómina a CSV y PDF** · [#33](https://github.com/DylanSrz/FinancieraRiwi/issues/33)

> **Como** auxiliar contable, **quiero** exportar el resumen del periodo, **para** compartirlo con tesorería y archivarlo.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 3 | Sprint 3 | @Gonza204658 | RF-24 | — |

**Criterios de aceptación**

1. Dado un periodo liquidado, cuando exporto a CSV, entonces obtengo una fila por colaborador con todos los conceptos.
2. Dado un periodo liquidado, cuando exporto a PDF, entonces obtengo un reporte con encabezado de la empresa, periodo y totales.

### HU-25

**Enviar el desprendible de pago a cada colaborador** · [#34](https://github.com/DylanSrz/FinancieraRiwi/issues/34)

> **Como** colaborador, **quiero** recibir en mi correo el desprendible de nómina, **para** conocer cómo se calculó mi pago.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Should | 3 | Sprint 2 | @Nesdael | RF-25 | — |

**Criterios de aceptación**

1. Dado un periodo CERRADO, cuando el auxiliar envía los desprendibles, entonces cada colaborador recibe un correo (Resend) con su detalle de devengados, deducciones y neto.
2. Dado un correo que rebota o falla, entonces queda marcado como fallido y se puede reenviar individualmente.
3. Dado que ya se enviaron, cuando se intenta enviar de nuevo masivamente, entonces se pide confirmación para evitar duplicados.

### HU-26

**Notificar al auxiliar contable el resultado de la ejecución** · [#35](https://github.com/DylanSrz/FinancieraRiwi/issues/35)

> **Como** auxiliar contable, **quiero** recibir un correo cuando termine la liquidación programada, **para** enterarme de inmediato si hubo errores.

| Prioridad | Puntos | Sprint | Responsable | Requerimiento | Reglas de negocio |
|---|---|---|---|---|---|
| Could | 2 | Sprint 2 | @Nesdael | RF-26 | RN-08 |

**Criterios de aceptación**

1. Dada una ejecución exitosa, entonces recibo un correo con periodo, número de colaboradores, total neto y enlace al resumen.
2. Dada una ejecución fallida o con advertencias, entonces el correo lista los errores y colaboradores omitidos.

---

## Tareas técnicas

| Tarea | Título | Épica | Sprint | Responsable | Issue |
|---|---|---|---|---|---|
| T-01 | Documentar visión, alcance y requerimientos funcionales | E0 | Sprint 0 | @DylanSrz | [#36](https://github.com/DylanSrz/FinancieraRiwi/issues/36) |
| T-02 | Documentar requerimientos no funcionales | E0 | Sprint 0 | @Kerin0011 | [#37](https://github.com/DylanSrz/FinancieraRiwi/issues/37) |
| T-03 | Especificar reglas de negocio y parámetros legales 2026 | E0 | Sprint 0 | @Kerin0011 | [#38](https://github.com/DylanSrz/FinancieraRiwi/issues/38) |
| T-04 | Redactar historias de usuario y criterios de aceptación | E0 | Sprint 0 | @DylanSrz | [#39](https://github.com/DylanSrz/FinancieraRiwi/issues/39) |
| T-05 | Modelar casos de uso | E0 | Sprint 0 | @Nesdael | [#40](https://github.com/DylanSrz/FinancieraRiwi/issues/40) |
| T-06 | Registrar supuestos, preguntas abiertas y guion de entrevista | E0 | Sprint 0 | @Nesdael | [#41](https://github.com/DylanSrz/FinancieraRiwi/issues/41) |
| T-07 | Construir la matriz de trazabilidad | E0 | Sprint 0 | @Nesdael | [#42](https://github.com/DylanSrz/FinancieraRiwi/issues/42) |
| T-08 | Diseñar el modelo de datos (ERD) y el schema de Prisma | E0 | Sprint 0 | @Kerin0011 | [#43](https://github.com/DylanSrz/FinancieraRiwi/issues/43) |
| T-09 | Definir arquitectura, API y registrar decisiones (ADR) | E0 | Sprint 0 | @Kerin0011 | [#44](https://github.com/DylanSrz/FinancieraRiwi/issues/44) |
| T-10 | Diseñar wireframes de baja fidelidad | E0 | Sprint 0 | @Gonza204658 | [#45](https://github.com/DylanSrz/FinancieraRiwi/issues/45) |
| T-11 | Crear el esqueleto del backend (NestJS + Prisma) | E0 | Sprint 0 | @DylanSrz | [#46](https://github.com/DylanSrz/FinancieraRiwi/issues/46) |
| T-12 | Crear el esqueleto del frontend (React + Vite) | E0 | Sprint 0 | @Gonza204658 | [#47](https://github.com/DylanSrz/FinancieraRiwi/issues/47) |
| T-13 | Definir reglas de trabajo, plantillas y CI | E0 | Sprint 0 | @Nesdael | [#48](https://github.com/DylanSrz/FinancieraRiwi/issues/48) |
| T-14 | Validar requerimientos con el cliente (entrevista) | E0 | Sprint 1 | @Nesdael | [#49](https://github.com/DylanSrz/FinancieraRiwi/issues/49) |
| T-15 | Configurar Supabase y aplicar migraciones iniciales | E8 | Sprint 1 | @Kerin0011 | [#50](https://github.com/DylanSrz/FinancieraRiwi/issues/50) |
| T-16 | Configurar Resend y credenciales OAuth de Google | E8 | Sprint 1 | @Kerin0011 | [#51](https://github.com/DylanSrz/FinancieraRiwi/issues/51) |
| T-17 | Programar el disparador diario con pg_cron + pg_net | E8 | Sprint 2 | @Nesdael | [#52](https://github.com/DylanSrz/FinancieraRiwi/issues/52) |
| T-18 | Desplegar el backend en Render | E8 | Sprint 3 | @Kerin0011 | [#53](https://github.com/DylanSrz/FinancieraRiwi/issues/53) |
| T-19 | Desplegar el frontend en Vercel | E8 | Sprint 3 | @Gonza204658 | [#54](https://github.com/DylanSrz/FinancieraRiwi/issues/54) |
| T-20 | Pruebas de aceptación end-to-end y regresión | E8 | Sprint 3 | @Nesdael | [#55](https://github.com/DylanSrz/FinancieraRiwi/issues/55) |
| T-21 | Manual de usuario y preparación de la demo | E0 | Sprint 3 | @DylanSrz | [#56](https://github.com/DylanSrz/FinancieraRiwi/issues/56) |
