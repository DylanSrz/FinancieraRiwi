/** Tipos de las respuestas de la API (ver docs/diseno/api.md). */

export type RolColaborador = 'GERENTE' | 'ADMINISTRADOR' | 'OPERARIO';
export const ROLES_COLABORADOR: RolColaborador[] = ['GERENTE', 'ADMINISTRADOR', 'OPERARIO'];

export interface Colaborador {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolColaborador;
  edad: number;
  hijos: number;
  claseRiesgoArl: number;
  activo: boolean;
}

export interface Pagina<T> {
  datos: T[];
  total: number;
  pagina: number;
  porPagina: number;
}

export interface PrevisualizacionCsv {
  total: number;
  validas: {
    fila: number;
    accion: 'crear' | 'actualizar';
    datos: Omit<Colaborador, 'id' | 'activo' | 'claseRiesgoArl'>;
  }[];
  invalidas: { fila: number; datos: Record<string, string>; errores: string[] }[];
}

export interface ResultadoImportacion {
  creados: number;
  actualizados: number;
  rechazados: number;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'AUX_CONTABLE';
  estado: 'PENDIENTE' | 'ACTIVO' | 'INACTIVO';
  ultimoAcceso: string | null;
  conGoogle: boolean;
}

export interface TramoFsp {
  desdeSmmlv: number;
  hastaSmmlv: number | null;
  tasa: number;
}

export interface ParametrosLegales {
  anio: number;
  smmlv: number;
  auxilioTransporte: number;
  topeAuxilioSmmlv: number;
  saludEmpleado: number;
  pensionEmpleado: number;
  saludEmpleador: number;
  pensionEmpleador: number;
  cajaCompensacion: number;
  icbf: number;
  sena: number;
  topeExoneracionSmmlv: number;
  horasMaxMes: number;
  fspTramos: TramoFsp[];
  arlTarifas: Record<string, number>;
  actualizadoEn: string;
}

export interface ValoresHora {
  vigentes: { rol: RolColaborador; valorHora: number | null; vigenteDesde: string | null }[];
  historico: {
    id: string;
    rol: RolColaborador;
    valorHora: number;
    vigenteDesde: string;
    creadoEn: string;
  }[];
}

export interface Bonificacion {
  hijos: number;
  valor: number;
  vigenteDesde: string | null;
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
