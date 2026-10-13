import { describe, expect, it } from 'vitest';
import { fecha, pesos, porcentaje } from './formato';

describe('formato', () => {
  it('formatea pesos colombianos sin decimales', () => {
    expect(pesos(3_740_295).replace(/\s/g, ' ')).toBe('$ 3.740.295');
    expect(pesos(-0).replace(/\s/g, ' ')).toBe('$ 0');
  });

  it('formatea porcentajes', () => {
    expect(porcentaje(0.04)).toBe('4 %');
    expect(porcentaje(0.00522)).toBe('0,522 %');
  });

  it('formatea fechas en UTC', () => {
    expect(fecha('2026-10-30T00:00:00.000Z')).toBe('30/10/2026');
    expect(fecha(null)).toBe('—');
  });
});
