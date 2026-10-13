import { describe, expect, it } from 'vitest';
import { csvDeErrores } from './csv';

describe('csvDeErrores (HU-08)', () => {
  it('incluye la fila, los datos originales y los errores, escapando comas', () => {
    const csv = csvDeErrores([
      {
        fila: 4,
        datos: {
          nombres: 'Jorge',
          apellidos: 'Ramírez, López',
          rol: 'supervisor',
          email: 'j@r.co',
          edad: '22',
          hijos: '1',
        },
        errores: ['Rol no válido', 'Otro error'],
      },
    ]);
    expect(csv.split('\n')).toEqual([
      'fila,nombres,apellidos,rol,email,edad,hijos,errores',
      '4,Jorge,"Ramírez, López",supervisor,j@r.co,22,1,Rol no válido | Otro error',
    ]);
  });
});
