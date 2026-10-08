import type { ParametrosLiquidacion } from './tipos.js';

/**
 * Parámetros vigentes en 2026 (fuente: Decretos 1469 y 1470 de 2025, Ley 100 de 1993, Ley 797 de 2003,
 * Decreto 1295 de 1994, art. 114-1 E.T.). Se usan en pruebas y en el seed; en ejecución se leen de la BD.
 */
export const PARAMETROS_2026: ParametrosLiquidacion = {
  valorHora: { GERENTE: 50_000, ADMINISTRADOR: 35_000, OPERARIO: 20_000 },
  bonificacionHijos: { 1: 200_000, 2: 400_000, 3: 600_000 },
  smmlv: 1_750_905,
  auxilioTransporte: 249_095,
  topeAuxilioSmmlv: 2,
  saludEmpleado: 0.04,
  pensionEmpleado: 0.04,
  fspTramos: [
    { desdeSmmlv: 4, hastaSmmlv: 16, tasa: 0.01 },
    { desdeSmmlv: 16, hastaSmmlv: 17, tasa: 0.012 },
    { desdeSmmlv: 17, hastaSmmlv: 18, tasa: 0.014 },
    { desdeSmmlv: 18, hastaSmmlv: 19, tasa: 0.016 },
    { desdeSmmlv: 19, hastaSmmlv: 20, tasa: 0.018 },
    { desdeSmmlv: 20, hastaSmmlv: null, tasa: 0.02 },
  ],
  saludEmpleador: 0.085,
  pensionEmpleador: 0.12,
  cajaCompensacion: 0.04,
  icbf: 0.03,
  sena: 0.02,
  topeExoneracionSmmlv: 10,
  arlTarifas: {
    '1': 0.00522,
    '2': 0.01044,
    '3': 0.02436,
    '4': 0.0435,
    '5': 0.0696,
  },
};
