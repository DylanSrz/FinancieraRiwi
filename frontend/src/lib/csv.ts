import type { PrevisualizacionCsv } from './tipos';

/** Descarga un texto como archivo CSV (UTF-8 con BOM para que Excel respete las tildes). */
export function descargarCsv(nombre: string, contenido: string): void {
  const url = URL.createObjectURL(new Blob(['﻿', contenido], { type: 'text/csv;charset=utf-8' }));
  const enlace = Object.assign(document.createElement('a'), { href: url, download: nombre });
  enlace.click();
  URL.revokeObjectURL(url);
}

const celda = (valor: string) => (/[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor);

/** HU-08: CSV con las filas inválidas y una columna `errores`. */
export function csvDeErrores(invalidas: PrevisualizacionCsv['invalidas']): string {
  const columnas = ['fila', 'nombres', 'apellidos', 'rol', 'email', 'edad', 'hijos', 'errores'];
  const filas = invalidas.map((i) =>
    [String(i.fila), ...columnas.slice(1, -1).map((c) => i.datos[c] ?? ''), i.errores.join(' | ')]
      .map(celda)
      .join(','),
  );
  return [columnas.join(','), ...filas].join('\n');
}
