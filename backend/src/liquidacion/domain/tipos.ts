/**
 * Tipos del motor de liquidación. El motor es una función pura (sin base de datos ni fechas del sistema)
 * para poder probarlo con los casos de docs/requerimientos/04-reglas-de-negocio.md.
 * Todos los montos están en pesos colombianos; se redondean al peso por concepto (RN-13).
 */

export type Rol = 'GERENTE' | 'ADMINISTRADOR' | 'OPERARIO';

export interface EntradaLiquidacion {
  rol: Rol;
  horas: number;
  hijos: number;
  /** Clase de riesgo ARL 1..5 (por defecto 1). */
  claseRiesgoArl: number;
}

export interface TramoFsp {
  desdeSmmlv: number;
  /** null = sin límite superior. */
  hastaSmmlv: number | null;
  tasa: number;
}

/** Parámetros vigentes para el periodo (año del periodo + valores con vigencia a la fecha de corte). */
export interface ParametrosLiquidacion {
  valorHora: Record<Rol, number>;
  /** Clave = número de hijos (3 aplica para 3 o más). */
  bonificacionHijos: Record<1 | 2 | 3, number>;
  smmlv: number;
  auxilioTransporte: number;
  topeAuxilioSmmlv: number;
  saludEmpleado: number;
  pensionEmpleado: number;
  fspTramos: TramoFsp[];
  saludEmpleador: number;
  pensionEmpleador: number;
  cajaCompensacion: number;
  icbf: number;
  sena: number;
  topeExoneracionSmmlv: number;
  arlTarifas: Record<string, number>;
}

export interface ResultadoLiquidacion {
  valorHora: number;
  devengadoBasico: number;
  bonificacionHijos: number;
  auxilioTransporte: number;
  totalDevengado: number;
  ibc: number;
  saludEmpleado: number;
  pensionEmpleado: number;
  fsp: number;
  totalDeducciones: number;
  netoPagar: number;
  saludEmpleador: number;
  pensionEmpleador: number;
  arl: number;
  cajaCompensacion: number;
  icbf: number;
  sena: number;
  cesantias: number;
  interesesCesantias: number;
  prima: number;
  vacaciones: number;
  costoEmpleador: number;
  alertas: string[];
}
