import {
  ArchivoCsvInvalidoError,
  validarCsvColaboradores,
  validarFila,
} from './importacion-csv.js';

const ENCABEZADO = 'nombres,apellidos,rol,email,edad,hijos';
const csv = (...filas: string[]) => [ENCABEZADO, ...filas].join('\n');

describe('validarCsvColaboradores (HU-07, HU-08, RN-19)', () => {
  it('acepta filas válidas y normaliza rol y email', () => {
    const r = validarCsvColaboradores(
      csv('Ana María,Pérez Gómez,Operario,ANA@Riwi.com,29,2'),
    );
    expect(r.total).toBe(1);
    expect(r.invalidas).toEqual([]);
    expect(r.validas[0]).toEqual({
      fila: 2,
      datos: {
        nombres: 'Ana María',
        apellidos: 'Pérez Gómez',
        rol: 'OPERARIO',
        email: 'ana@riwi.com',
        edad: 29,
        hijos: 2,
      },
    });
  });

  it('reconoce roles con tildes y mayúsculas', () => {
    expect(
      validarFila({
        nombres: 'Luis',
        apellidos: 'Díaz',
        rol: 'ADMINISTRADOR',
        email: 'l@r.co',
        edad: '30',
        hijos: '0',
      }).datos?.rol,
    ).toBe('ADMINISTRADOR');
  });

  it('marca "Rol no válido" con el valor recibido', () => {
    const r = validarCsvColaboradores(
      csv('Jorge,Ramírez,supervisor,jorge@riwi.com,22,1'),
    );
    expect(r.invalidas[0].errores).toEqual([
      'Rol no válido ("supervisor"): use gerente, administrador u operario',
    ]);
  });

  it.each([
    ['17', 'Edad no válida (debe estar entre 18 y 100)'],
    ['abc', 'Edad no válida (debe estar entre 18 y 100)'],
  ])('edad %s → error', (edad, mensaje) => {
    const r = validarCsvColaboradores(
      csv(`Ana,Pérez,operario,a@r.co,${edad},0`),
    );
    expect(r.invalidas[0].errores).toContain(mensaje);
  });

  it.each(['-1', '1.5', ''])('hijos "%s" → error', (hijos) => {
    const r = validarCsvColaboradores(
      csv(`Ana,Pérez,operario,a@r.co,30,${hijos}`),
    );
    expect(r.invalidas[0].errores).toContain(
      'Número de hijos no válido (entero mayor o igual a 0)',
    );
  });

  it('detecta email mal formado y email repetido en el archivo', () => {
    const r = validarCsvColaboradores(
      csv(
        'Ana,Pérez,operario,no-es-email,30,0',
        'Ana,Pérez,operario,a@r.co,30,0',
        'Eva,Ruiz,gerente,A@R.CO,40,1',
      ),
    );
    expect(r.validas.map((v) => v.fila)).toEqual([3]);
    expect(r.invalidas.map((v) => [v.fila, v.errores])).toEqual([
      [2, ['Email no válido']],
      [4, ['Email repetido en el archivo (también en la fila 3)']],
    ]);
  });

  it('acumula varios errores en la misma fila', () => {
    const r = validarCsvColaboradores(csv(',Pérez,jefe,x,10,-2'));
    expect(r.invalidas[0].errores).toHaveLength(5);
  });

  it('acepta BOM, líneas vacías y encabezados con mayúsculas', () => {
    const r = validarCsvColaboradores(
      '﻿Nombres,Apellidos,Rol,Email,Edad,Hijos\n\nAna,Pérez,operario,a@r.co,30,0\n',
    );
    expect(r.validas).toHaveLength(1);
  });

  it('rechaza un archivo sin columnas obligatorias', () => {
    expect(() => validarCsvColaboradores('nombres,email\nAna,a@r.co')).toThrow(
      new ArchivoCsvInvalidoError(
        'Faltan columnas obligatorias: apellidos, rol, edad, hijos',
      ),
    );
  });

  it('rechaza un archivo vacío', () => {
    expect(() => validarCsvColaboradores(ENCABEZADO)).toThrow(
      ArchivoCsvInvalidoError,
    );
  });
});
