import { pendiente } from '../common/pendiente.js';

/**
 * RN-08: la liquidación automática corre el día 30 de cada mes a las 7:00 p. m. (hora de la empresa).
 * Si el mes tiene menos de 30 días (febrero), corre el último día del mes.
 * Recibe la fecha/hora actual para que sea determinista en pruebas.
 */
export function esDiaDeLiquidacion(
  _ahora: Date,
  _zonaHoraria: string,
): boolean {
  pendiente('HU-17');
}
