# Falta de software para la liquidación de nómina

> La empresa Financiera Riwi esta fallando en el área de contabilidad al realizar las liquidaciones de nómina en su mayoría incorrectas. Como consecuencia se esta evidenciando una carga operativa adicional en el área de contabilidad dado que toca resolver esas inconsistencias constantemente retrasan otras funciones.

## Problema

Al momento de realizar la liquidación de nomina hay muchos errores en los valores pagados a los colaboradores. Dado que no hay un manejo adecuado de las posibles variables que afectan el valor a pagar.

**Causa raíz:** No existe un proceso especifico para que los colaboradores suministren esta información necesaria para la respectiva liquidación de su nomina. Falta de conocimiento tecnológico en el área de contabilidad para mantener actualizada la información de para fiscales.

## Requisitos

_Como aux. contable, quiero tener un software que permita automatizar la liquidación de nomina, para no caer en errores en la gestión._

- **Entradas:** Archivo CSV importado al nuevo software para la liquidación de nomina con: nombres, apellidos, rol, email, edad, hijos
- **Salidas:** calculo de la liquidación de nomina automatizada teniendo en cuenta todas las variables.

### Reglas de negocio

- Si es gerente, entonces valor hora $50.000
- Si es administrador, entonces valor hora $35.000
- Si es operario, entonces valor hora $20.000
- Si tiene 1 hijo, entonces bonifican $200.000
- Si tiene 2 hijos, entonces bonifican $400.000
- Si tiene 3 hijos o más, entonces bonifican $600.000
- El valor de liquidación se calcula en la cantidad de horas por el valor de hora según su rol y se adiciona las bonificaciones cuando apliquen.

**Restricciones:** Debe ejecutarse el calculo automático cada día 30 del mes en curso a las 7:00pm.

**Fuera del alcance:** Realizar el pago automático del valor devengado por el colaborador.

## Solución elegida

**software de nomina.** Elegimos el software de nomina, porque nos permite automatizar este proceso sin saltarse las reglas.

## Cómo ejecutar

```bash
npm run start:dev
```

## Algoritmo

1. Inicio
2. colaborador se registra
3. si rol es gerente o admin
4. Fin

## Autor y versión

RiwiTech · versión 1.0

Código: https://github.com/DylanSrz/FinancieraRiwi.git
