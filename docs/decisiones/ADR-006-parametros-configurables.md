# ADR-006 · Parámetros legales y de negocio configurables con vigencia

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | @DylanSrz, @Kerin0011 |
| **Issue** | #38 (T-03) · HU-21, HU-22 |

## Contexto

Una de las **causas raíz** es que contabilidad no logra mantener actualizados los valores legales (salario mínimo, auxilio, porcentajes de aportes y parafiscales), que cambian cada año. Si esos valores quedan fijos en el código, cada cambio exige un desarrollador y un despliegue.

## Decisión

- **Parámetros legales:** van en la tabla `parametros_legales`, **un registro por año**. Incluyen los tramos del FSP y las tarifas de ARL como JSON.
- **Reglas de la empresa:** el valor hora por rol y la bonificación por hijos van en tablas con `vigente_desde`.
- **Qué valores se usan:** el motor recibe los parámetros del **año del periodo** y los valores **vigentes en la fecha de corte**.
- **Copia de respaldo:** cada liquidación guarda `parametrosUsados`, así cambios posteriores no alteran periodos ya calculados.
- **Valores iniciales:** el seed carga los valores de 2026 (Decretos 1469 y 1470 de 2025).

## Consecuencias

- **Actualizar sin desplegar:** para cambiar el SMMLV de 2027, el administrador registra el año 2027 en la pantalla de Parámetros.
- **Sin parámetros, no se liquida:** si falta el año, la liquidación falla con un mensaje claro. Nunca usa valores incorrectos.
- **Pruebas:** el motor sigue siendo puro y se prueba con `PARAMETROS_2026`.
