import { pendiente } from '../../common/pendiente.js';
import type {
  EntradaLiquidacion,
  ParametrosLiquidacion,
  ResultadoLiquidacion,
} from './tipos.js';

/**
 * Calcula la liquidación mensual de un colaborador.
 * Algoritmo: docs/diseno/algoritmo-liquidacion.md · Reglas: RN-01 a RN-14.
 *
 * Se implementa por partes en HU-12 (básico), HU-13 (bonificación), HU-14 (auxilio),
 * HU-15 (deducciones) y HU-16 (aportes del empleador y provisiones).
 */
export function calcularLiquidacion(
  _entrada: EntradaLiquidacion,
  _parametros: ParametrosLiquidacion,
): ResultadoLiquidacion {
  pendiente('HU-12…HU-16');
}
