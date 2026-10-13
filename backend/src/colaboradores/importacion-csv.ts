import { parse } from 'csv-parse/sync';
import type { RolColaborador } from '../generated/prisma/enums.js';

/** Encabezados obligatorios del CSV (docs/requerimientos/02-requerimientos-funcionales.md). */
export const COLUMNAS_CSV = [
  'nombres',
  'apellidos',
  'rol',
  'email',
  'edad',
  'hijos',
] as const;
export const TAMANO_MAXIMO_CSV = 5 * 1024 * 1024;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROLES: Record<string, RolColaborador> = {
  gerente: 'GERENTE',
  administrador: 'ADMINISTRADOR',
  operario: 'OPERARIO',
};

export interface ColaboradorCsv {
  nombres: string;
  apellidos: string;
  rol: RolColaborador;
  email: string;
  edad: number;
  hijos: number;
}

export interface FilaValida {
  fila: number;
  datos: ColaboradorCsv;
}

export interface FilaInvalida {
  fila: number;
  datos: Record<string, string>;
  errores: string[];
}

export interface ResultadoValidacionCsv {
  total: number;
  validas: FilaValida[];
  invalidas: FilaInvalida[];
}

export class ArchivoCsvInvalidoError extends Error {}

const sinTildes = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '');

function entero(valor: string): number | null {
  return /^-?\d+$/.test(valor) ? Number(valor) : null;
}

/** RN-19: valida una fila y devuelve los datos normalizados o la lista de errores. */
export function validarFila(datos: Record<string, string>): {
  datos?: ColaboradorCsv;
  errores: string[];
} {
  const errores: string[] = [];
  const nombres = datos.nombres?.trim() ?? '';
  const apellidos = datos.apellidos?.trim() ?? '';
  const email = datos.email?.trim().toLowerCase() ?? '';
  const rol = ROLES[sinTildes(datos.rol?.trim().toLowerCase() ?? '')];
  const edad = entero(datos.edad?.trim() ?? '');
  const hijos = entero(datos.hijos?.trim() ?? '');

  if (nombres.length < 2 || nombres.length > 100)
    errores.push('Nombres obligatorios (2 a 100 caracteres)');
  if (apellidos.length < 2 || apellidos.length > 100)
    errores.push('Apellidos obligatorios (2 a 100 caracteres)');
  if (!rol)
    errores.push(
      `Rol no válido ("${datos.rol ?? ''}"): use gerente, administrador u operario`,
    );
  if (!EMAIL.test(email)) errores.push('Email no válido');
  if (edad === null || edad < 18 || edad > 100)
    errores.push('Edad no válida (debe estar entre 18 y 100)');
  if (hijos === null || hijos < 0)
    errores.push('Número de hijos no válido (entero mayor o igual a 0)');

  return errores.length
    ? { errores }
    : {
        datos: {
          nombres,
          apellidos,
          rol: rol!,
          email,
          edad: edad!,
          hijos: hijos!,
        },
        errores,
      };
}

/**
 * HU-07 / HU-08: lee el CSV (UTF-8, coma, con encabezados) y valida cada fila.
 * La fila 1 es el encabezado, así que la primera fila de datos es la 2.
 */
export function validarCsvColaboradores(
  contenido: Buffer | string,
): ResultadoValidacionCsv {
  let registros: Record<string, string>[];
  try {
    registros = parse(contenido, {
      bom: true,
      columns: (encabezados: string[]) =>
        encabezados.map((e) => sinTildes(e.trim().toLowerCase())),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
  } catch (e) {
    throw new ArchivoCsvInvalidoError(
      `El archivo no es un CSV válido: ${(e as Error).message}`,
    );
  }

  const primera = registros[0];
  if (!primera)
    throw new ArchivoCsvInvalidoError('El archivo no tiene filas de datos');
  const faltantes = COLUMNAS_CSV.filter((c) => !(c in primera));
  if (faltantes.length) {
    throw new ArchivoCsvInvalidoError(
      `Faltan columnas obligatorias: ${faltantes.join(', ')}`,
    );
  }

  const validas: FilaValida[] = [];
  const invalidas: FilaInvalida[] = [];
  const vistos = new Map<string, number>();

  registros.forEach((datos, i) => {
    const fila = i + 2;
    const { datos: normalizados, errores } = validarFila(datos);
    const email = datos.email?.trim().toLowerCase();
    if (email && vistos.has(email)) {
      errores.push(
        `Email repetido en el archivo (también en la fila ${vistos.get(email)})`,
      );
    } else if (email) {
      vistos.set(email, fila);
    }
    if (errores.length || !normalizados) {
      invalidas.push({ fila, datos, errores });
    } else {
      validas.push({ fila, datos: normalizados });
    }
  });

  return { total: registros.length, validas, invalidas };
}
