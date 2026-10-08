# 04 · Reglas de negocio

Reglas que el sistema debe aplicar **sin excepciones**. Hay dos fuentes:

- **Cliente:** el documento inicial ([00-toma-inicial.md](00-toma-inicial.md)), reglas RN-01 a RN-08.
- **Ley:** la normativa laboral colombiana vigente en 2026, reglas RN-09 a RN-14.

Los valores numéricos son **parámetros configurables** (ADR-006) y no están fijos en el código. Los casos de prueba al final del documento son la referencia oficial para las pruebas del motor de liquidación.

## Glosario

| Término | Definición |
|---|---|
| **SMMLV** | Salario mínimo mensual legal vigente: **$1.750.905** en 2026 (Decreto 1469 de 2025) |
| **Devengado básico** | Horas trabajadas en el periodo × valor hora del rol |
| **Total devengado** | Devengado básico + bonificación por hijos + auxilio de transporte |
| **IBC** | Ingreso base de cotización, la base para salud, pensión, FSP, aportes y parafiscales. En v1 **IBC = devengado básico** (la bonificación y el auxilio no son salario; supuesto S-03) |
| **Neto a pagar** | Total devengado − deducciones del colaborador |
| **Costo empleador** | Total devengado + aportes del empleador + parafiscales + provisiones |
| **Periodo** | Mes calendario de nómina (supuesto S-04: pago mensual) |

## Reglas del cliente

| ID | Regla | Parámetro (2026) |
|---|---|---|
| **RN-01** | Si el rol es **gerente**, el valor hora es $50.000 | `valor_hora_rol` |
| **RN-02** | Si el rol es **administrador**, el valor hora es $35.000 | `valor_hora_rol` |
| **RN-03** | Si el rol es **operario**, el valor hora es $20.000 | `valor_hora_rol` |
| **RN-04** | Si tiene **1 hijo**, se bonifican $200.000 | `bonificaciones_hijos` |
| **RN-05** | Si tiene **2 hijos**, se bonifican $400.000 | `bonificaciones_hijos` |
| **RN-06** | Si tiene **3 o más hijos**, se bonifican $600.000 | `bonificaciones_hijos` |
| **RN-07** | Devengado básico = horas × valor hora del rol. La bonificación se suma cuando aplica | — |
| **RN-08** | La liquidación se ejecuta **automáticamente el día 30 de cada mes a las 7:00 p. m.** (`America/Bogota`). Si el mes tiene menos de 30 días (febrero), se ejecuta el **último día del mes** a la misma hora (ADR-007) | — |

## Reglas legales (Colombia, 2026)

### RN-09 · Auxilio de transporte

- **Si devengado básico ≤ 2 SMMLV ($3.501.810):** se paga el auxilio completo, **$249.095** (Decreto 1470 de 2025).
- **Si devengado básico > 2 SMMLV:** no se paga auxilio.
- El auxilio **no** forma parte del IBC (no cotiza a salud ni a pensión), pero **sí** de la base de cesantías y prima.
- Con 0 horas en el periodo no hay liquidación, y por tanto tampoco auxilio.

### RN-10 · Salud del colaborador

Salud = IBC × **4 %** (Ley 100 de 1993, art. 204).

### RN-11 · Pensión del colaborador

Pensión = IBC × **4 %** (Ley 100 de 1993, art. 20).

### RN-12 · Fondo de Solidaridad Pensional (FSP)

Se descuenta si el IBC es **≥ 4 SMMLV** ($7.003.620), según los tramos de la Ley 797 de 2003, art. 8:

| IBC en SMMLV | Tasa |
|---|---|
| ≥ 4 y < 16 | 1,0 % |
| ≥ 16 y < 17 | 1,2 % |
| ≥ 17 y < 18 | 1,4 % |
| ≥ 18 y < 19 | 1,6 % |
| ≥ 19 y ≤ 20 | 1,8 % |
| > 20 | 2,0 % |

### RN-13 · Neto a pagar y redondeo

- **Neto a pagar** = total devengado − (salud + pensión + FSP).
- **Redondeo:** cada concepto se calcula con los valores sin redondear y se redondea **al peso más cercano**, con las mitades hacia arriba. Los totales son la suma de los conceptos ya redondeados.
- **Alerta:** si el IBC es menor a 1 SMMLV, la liquidación se marca con *"IBC inferior al salario mínimo"*. Se calcula igual, pero queda para revisión (supuesto S-09).

### RN-14 · Costo del empleador

**Aportes y parafiscales** (base: IBC)

| Concepto | Tasa | Norma | Exoneración |
|---|---|---|---|
| Salud empleador | 8,5 % | Ley 100/1993 | **Exonerado** si IBC < 10 SMMLV (art. 114-1 E.T.) |
| Pensión empleador | 12 % | Ley 100/1993 | — |
| ARL | Según la clase de riesgo: I 0,522 % · II 1,044 % · III 2,436 % · IV 4,35 % · V 6,96 % | Decreto 1295/1994 | — (clase I por defecto) |
| Caja de compensación | 4 % | Ley 21/1982 | — |
| ICBF | 3 % | Ley 89/1988 | **Exonerado** si IBC < 10 SMMLV |
| SENA | 2 % | Ley 21/1982 | **Exonerado** si IBC < 10 SMMLV |

**Provisiones mensuales de prestaciones sociales**

| Concepto | Fórmula | Base |
|---|---|---|
| Cesantías | base / 12 | Devengado básico + auxilio de transporte |
| Intereses sobre cesantías | cesantías × 12 % | Cesantías del mes |
| Prima de servicios | base / 12 | Devengado básico + auxilio de transporte |
| Vacaciones | base / 24 (15 días por año) | Devengado básico |

> **Observación de análisis:** con el tope de 180 horas al mes (RN-15), el IBC máximo posible es el de un gerente con 180 h: $9.000.000, que equivale a 5,14 SMMLV. Por eso, **con los parámetros actuales la exoneración siempre aplica** y el FSP nunca supera el 1 %. Aun así, el motor implementa la regla completa (caso CP-12), porque los parámetros pueden cambiar.

## Reglas de operación

| ID | Regla |
|---|---|
| **RN-15** | Las horas de un colaborador en un periodo deben estar entre **0 y el máximo ordinario mensual**: 42 h/semana × 30/7 = **180 h** desde el 15 de julio de 2026 (Ley 2101 de 2021). Las horas extra están fuera de v1 |
| **RN-16** | El cálculo usa los **parámetros legales del año del periodo** y el **valor hora y la bonificación vigentes en la fecha de corte**. Los parámetros usados se guardan con cada liquidación (`parametrosUsados`), así que cambios posteriores no alteran periodos ya calculados |
| **RN-17** | **Idempotencia:** existe una sola liquidación por colaborador y periodo. Si la ejecución programada encuentra el periodo ya CALCULADO o CERRADO, no hace nada. Reliquidar reemplaza los valores y aumenta la versión |
| **RN-18** | **Estados del periodo:** ABIERTO → CALCULADO → CERRADO. Un periodo CERRADO es **inmutable**: no se modifican sus horas, liquidaciones ni parámetros |
| **RN-19** | **Validación de colaboradores:**<br>• rol ∈ {gerente, administrador, operario}<br>• edad entre 18 y 100<br>• hijos entero ≥ 0<br>• email válido y único por empresa<br>• nombres y apellidos obligatorios<br>Una fila inválida del CSV no se importa y se reporta |
| **RN-20** | **Acceso:**<br>• Solo usuarios invitados por un administrador. Google solo funciona con correos invitados.<br>• Contraseña de mínimo 8 caracteres, con al menos una mayúscula y un número.<br>• 5 intentos fallidos en 15 minutos bloquean la cuenta 15 minutos.<br>• Enlaces de invitación válidos por 48 h; de recuperación, por 30 min; ambos de un solo uso |

## Algoritmo resumido

El algoritmo detallado, con su diagrama, está en [docs/diseno/algoritmo-liquidacion.md](../diseno/algoritmo-liquidacion.md).

```
básico      = horas × valorHora[rol]
bonif       = tablaHijos[min(hijos, 3)]            (0 si hijos = 0)
auxilio     = básico ≤ 2·SMMLV ? auxilioTransporte : 0
IBC         = básico
salud       = IBC × 4 %      pensión = IBC × 4 %      fsp = IBC × tasaFSP(IBC / SMMLV)
neto        = (básico + bonif + auxilio) − (salud + pensión + fsp)
exonerado   = IBC < 10·SMMLV
empleador   = salud 8,5 % (si no exonerado) + pensión 12 % + ARL + caja 4 % + ICBF 3 %/SENA 2 % (si no exonerado)
provisiones = cesantías + intereses + prima + vacaciones
costo       = total devengado + empleador + provisiones
```

## Casos de prueba

Estos casos son la referencia para `backend/src/liquidacion/domain/calculadora-nomina.spec.ts`. Usan los parámetros de 2026, ARL clase I y valores en pesos.

### Casos de liquidación (colaborador)

| Caso | Rol | Horas | Hijos | Básico | Bonificación | Auxilio | Total devengado | Salud | Pensión | FSP | Neto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **CP-01** | Operario | 168 | 2 | 3.360.000 | 400.000 | 249.095 | 4.009.095 | 134.400 | 134.400 | 0 | **3.740.295** |
| **CP-02** | Gerente | 160 | 0 | 8.000.000 | 0 | 0 | 8.000.000 | 320.000 | 320.000 | 80.000 | **7.280.000** |
| **CP-03** | Administrador | 180 | 3 | 6.300.000 | 600.000 | 0 | 6.900.000 | 252.000 | 252.000 | 0 | **6.396.000** |
| **CP-04** ⚠️ | Operario | 80 | 1 | 1.600.000 | 200.000 | 249.095 | 2.049.095 | 64.000 | 64.000 | 0 | **1.921.095** |
| **CP-05** | Operario | 100 | 5 | 2.000.000 | 600.000 | 249.095 | 2.849.095 | 80.000 | 80.000 | 0 | **2.689.095** |
| **CP-06a** | Operario | 175 | 0 | 3.500.000 | 0 | 249.095 | 3.749.095 | 140.000 | 140.000 | 0 | **3.469.095** |
| **CP-06b** | Operario | 176 | 0 | 3.520.000 | 0 | 0 | 3.520.000 | 140.800 | 140.800 | 0 | **3.238.400** |
| **CP-07** | Gerente | 180 | 0 | 9.000.000 | 0 | 0 | 9.000.000 | 360.000 | 360.000 | 90.000 | **8.190.000** |
| **CP-11a** | Gerente | 140 | 0 | 7.000.000 | 0 | 0 | 7.000.000 | 280.000 | 280.000 | 0 | **6.440.000** |
| **CP-11b** | Gerente | 141 | 0 | 7.050.000 | 0 | 0 | 7.050.000 | 282.000 | 282.000 | 70.500 | **6.415.500** |

Qué prueba cada caso:

- **CP-04:** genera la alerta *"IBC inferior al salario mínimo"*.
- **CP-05:** la bonificación tiene tope de 3 o más hijos.
- **CP-06a / CP-06b:** límite de 2 SMMLV para el auxilio de transporte.
- **CP-11a / CP-11b:** límite de 4 SMMLV para el FSP ($7.003.620).

### Casos de costo del empleador

| Caso | Salud | Pensión | ARL | Caja | ICBF | SENA | Cesantías | Intereses | Prima | Vacaciones | Costo empleador |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **CP-01** | 0 | 403.200 | 17.539 | 134.400 | 0 | 0 | 300.758 | 36.091 | 300.758 | 140.000 | **5.341.841** |
| **CP-07** | 0 | 1.080.000 | 46.980 | 360.000 | 0 | 0 | 750.000 | 90.000 | 750.000 | 375.000 | **12.451.980** |

**CP-12:** con parámetros modificados para que el IBC sea ≥ 10 SMMLV (por ejemplo, SMMLV = $500.000 y gerente con 160 h, IBC $8.000.000 = 16 SMMLV), se calculan:

- salud empleador 8,5 % = $680.000
- ICBF 3 % = $240.000
- SENA 2 % = $160.000
- FSP 1,2 % = $96.000

### Casos de operación

| Caso | Escenario | Resultado esperado |
|---|---|---|
| **CP-08** | Calendario (RN-08) | `2026-10-30 19:00` Bogotá → liquida · `2026-10-29` → no · `2026-02-28` → liquida · `2028-02-29` → liquida · `2026-10-31` → no |
| **CP-09** | Parámetros por año (RN-16) | Un periodo de 2027 usa los parámetros de 2027. Sin parámetros, la ejecución falla con un mensaje claro |
| **CP-10** | Vigencia del valor hora (RN-16) | Un nuevo valor hora vigente desde el 1 de noviembre no afecta el periodo de octubre |

## Fuentes normativas

- [Decreto 1469 de 2025](https://consultorsalud.com/aumento-del-salario-minimo-en-colombia-2026/): SMMLV 2026 de $1.750.905.
- Decreto 1470 de 2025: auxilio de transporte 2026 de $249.095.
- Ley 100 de 1993: sistema de seguridad social en salud y pensión.
- Ley 797 de 2003, art. 8: Fondo de Solidaridad Pensional.
- Decreto 1295 de 1994 y Decreto 1772 de 1994: riesgos laborales y tarifas ARL.
- Estatuto Tributario, art. 114-1: exoneración de aportes a salud, SENA e ICBF.
- Ley 2101 de 2021: reducción gradual de la jornada laboral a 42 horas.
- Código Sustantivo del Trabajo, arts. 127, 128, 186, 249 y 306: salario, pagos no salariales, vacaciones, cesantías y prima.
