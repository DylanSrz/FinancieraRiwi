import type {
  EntradaLiquidacion,
  ParametrosLiquidacion,
  ResultadoLiquidacion,
  TramoFsp,
} from './tipos.js';

export const ALERTA_IBC_INFERIOR_SMMLV = 'IBC inferior al salario mínimo';

/** RN-13: redondeo al peso más cercano, mitades hacia arriba. */
export function redondear(valor: number): number {
  return Math.round(valor);
}

/** RN-04..06: 0 hijos → 0; 3 o más usan el valor de 3. */
export function bonificacionPorHijos(
  hijos: number,
  tabla: ParametrosLiquidacion['bonificacionHijos'],
): number {
  if (hijos <= 0) return 0;
  return tabla[Math.min(hijos, 3) as 1 | 2 | 3];
}

/** RN-12: tasa del Fondo de Solidaridad Pensional según el IBC expresado en SMMLV. */
export function tasaFsp(ibcEnSmmlv: number, tramos: TramoFsp[]): number {
  const tramo = tramos.find(
    (t) =>
      ibcEnSmmlv >= t.desdeSmmlv &&
      (t.hastaSmmlv === null || ibcEnSmmlv < t.hastaSmmlv),
  );
  return tramo?.tasa ?? 0;
}

/**
 * Calcula la liquidación mensual de un colaborador.
 * Algoritmo: docs/diseno/algoritmo-liquidacion.md · Reglas: RN-01 a RN-14.
 * Cada concepto se calcula sin redondear y se redondea al final; los totales suman conceptos redondeados.
 */
export function calcularLiquidacion(
  entrada: EntradaLiquidacion,
  p: ParametrosLiquidacion,
): ResultadoLiquidacion {
  if (entrada.horas < 0)
    throw new RangeError('Las horas no pueden ser negativas');
  if (entrada.hijos < 0)
    throw new RangeError('El número de hijos no puede ser negativo');

  // Devengados (RN-01..07, RN-09)
  const valorHora = p.valorHora[entrada.rol];
  const devengadoBasico = redondear(entrada.horas * valorHora);
  const bonificacionHijos = bonificacionPorHijos(
    entrada.hijos,
    p.bonificacionHijos,
  );
  const auxilioTransporte =
    entrada.horas > 0 && devengadoBasico <= p.topeAuxilioSmmlv * p.smmlv
      ? p.auxilioTransporte
      : 0;
  const totalDevengado =
    devengadoBasico + bonificacionHijos + auxilioTransporte;

  // Deducciones del colaborador (RN-10..13). IBC = devengado básico (supuesto S-03).
  const ibc = devengadoBasico;
  const saludEmpleado = redondear(ibc * p.saludEmpleado);
  const pensionEmpleado = redondear(ibc * p.pensionEmpleado);
  const fsp = redondear(ibc * tasaFsp(ibc / p.smmlv, p.fspTramos));
  const totalDeducciones = saludEmpleado + pensionEmpleado + fsp;
  const netoPagar = totalDevengado - totalDeducciones;

  // Costo del empleador (RN-14)
  const exonerado = ibc < p.topeExoneracionSmmlv * p.smmlv;
  const tarifaArl = p.arlTarifas[String(entrada.claseRiesgoArl)];
  if (tarifaArl === undefined) {
    throw new RangeError(
      `Clase de riesgo ARL no válida: ${entrada.claseRiesgoArl}`,
    );
  }
  const saludEmpleador = exonerado ? 0 : redondear(ibc * p.saludEmpleador);
  const pensionEmpleador = redondear(ibc * p.pensionEmpleador);
  const arl = redondear(ibc * tarifaArl);
  const cajaCompensacion = redondear(ibc * p.cajaCompensacion);
  const icbf = exonerado ? 0 : redondear(ibc * p.icbf);
  const sena = exonerado ? 0 : redondear(ibc * p.sena);

  const basePrestaciones = devengadoBasico + auxilioTransporte;
  const cesantiasSinRedondear = basePrestaciones / 12;
  const cesantias = redondear(cesantiasSinRedondear);
  const interesesCesantias = redondear(cesantiasSinRedondear * 0.12);
  const prima = redondear(basePrestaciones / 12);
  const vacaciones = redondear(devengadoBasico / 24);

  const costoEmpleador =
    totalDevengado +
    saludEmpleador +
    pensionEmpleador +
    arl +
    cajaCompensacion +
    icbf +
    sena +
    cesantias +
    interesesCesantias +
    prima +
    vacaciones;

  const alertas =
    entrada.horas > 0 && ibc < p.smmlv ? [ALERTA_IBC_INFERIOR_SMMLV] : [];

  return {
    valorHora,
    devengadoBasico,
    bonificacionHijos,
    auxilioTransporte,
    totalDevengado,
    ibc,
    saludEmpleado,
    pensionEmpleado,
    fsp,
    totalDeducciones,
    netoPagar,
    saludEmpleador,
    pensionEmpleador,
    arl,
    cajaCompensacion,
    icbf,
    sena,
    cesantias,
    interesesCesantias,
    prima,
    vacaciones,
    costoEmpleador,
    alertas,
  };
}
