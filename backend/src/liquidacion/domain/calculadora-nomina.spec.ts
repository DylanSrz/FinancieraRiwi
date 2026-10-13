/**
 * Casos de prueba del motor (docs/requerimientos/04-reglas-de-negocio.md, sección "Casos de prueba").
 * Parámetros 2026 y ARL clase I.
 */
import {
  ALERTA_IBC_INFERIOR_SMMLV,
  bonificacionPorHijos,
  calcularLiquidacion,
  tasaFsp,
} from './calculadora-nomina.js';
import { PARAMETROS_2026 as P } from './parametros-2026.js';
import type { EntradaLiquidacion, Rol } from './tipos.js';

const liquidar = (
  rol: Rol,
  horas: number,
  hijos: number,
  extra: Partial<EntradaLiquidacion> = {},
) => calcularLiquidacion({ rol, horas, hijos, claseRiesgoArl: 1, ...extra }, P);

describe('calcularLiquidacion', () => {
  describe('HU-12 devengado básico (RN-01..03, RN-07)', () => {
    it('CP-01 operario 168 h → básico $3.360.000', () => {
      expect(liquidar('OPERARIO', 168, 2).devengadoBasico).toBe(3_360_000);
    });
    it('CP-02 gerente 160 h → básico $8.000.000', () => {
      expect(liquidar('GERENTE', 160, 0).devengadoBasico).toBe(8_000_000);
    });
    it('CP-03 administrador 180 h → básico $6.300.000', () => {
      expect(liquidar('ADMINISTRADOR', 180, 3).devengadoBasico).toBe(6_300_000);
    });
    it('acepta horas con decimales', () => {
      expect(liquidar('OPERARIO', 10.5, 0).devengadoBasico).toBe(210_000);
    });
    it('rechaza horas negativas', () => {
      expect(() => liquidar('OPERARIO', -1, 0)).toThrow(RangeError);
    });
  });

  describe('HU-13 bonificación por hijos (RN-04..06)', () => {
    it.each([
      [0, 0],
      [1, 200_000],
      [2, 400_000],
      [3, 600_000],
      [5, 600_000],
    ])('%i hijos → $%i', (hijos, esperado) => {
      expect(bonificacionPorHijos(hijos, P.bonificacionHijos)).toBe(esperado);
    });
    it('CP-05 operario 100 h, 5 hijos → bonificación $600.000 y neto $2.689.095', () => {
      const r = liquidar('OPERARIO', 100, 5);
      expect(r.bonificacionHijos).toBe(600_000);
      expect(r.netoPagar).toBe(2_689_095);
    });
    it('la bonificación no hace parte del IBC', () => {
      expect(liquidar('OPERARIO', 168, 3).ibc).toBe(3_360_000);
    });
  });

  describe('HU-14 auxilio de transporte (RN-09)', () => {
    it('CP-01 básico $3.360.000 ≤ 2 SMMLV → auxilio $249.095', () => {
      expect(liquidar('OPERARIO', 168, 2).auxilioTransporte).toBe(249_095);
    });
    it('CP-02 básico $8.000.000 > 2 SMMLV → auxilio $0', () => {
      expect(liquidar('GERENTE', 160, 0).auxilioTransporte).toBe(0);
    });
    it('CP-06a operario 175 h → auxilio $249.095, neto $3.469.095', () => {
      const r = liquidar('OPERARIO', 175, 0);
      expect(r.auxilioTransporte).toBe(249_095);
      expect(r.netoPagar).toBe(3_469_095);
    });
    it('CP-06b operario 176 h ($3.520.000 > 2 SMMLV) → auxilio $0, neto $3.238.400', () => {
      const r = liquidar('OPERARIO', 176, 0);
      expect(r.auxilioTransporte).toBe(0);
      expect(r.netoPagar).toBe(3_238_400);
    });
    it('básico exactamente igual a 2 SMMLV → sí recibe auxilio', () => {
      const p = {
        ...P,
        valorHora: { ...P.valorHora, OPERARIO: (2 * P.smmlv) / 100 },
      };
      const r = calcularLiquidacion(
        { rol: 'OPERARIO', horas: 100, hijos: 0, claseRiesgoArl: 1 },
        p,
      );
      expect(r.devengadoBasico).toBe(3_501_810);
      expect(r.auxilioTransporte).toBe(249_095);
    });
    it('0 horas → sin auxilio', () => {
      expect(liquidar('OPERARIO', 0, 0).auxilioTransporte).toBe(0);
    });
  });

  describe('HU-15 deducciones (RN-10..13)', () => {
    it('CP-01 salud $134.400, pensión $134.400, FSP $0, neto $3.740.295', () => {
      const r = liquidar('OPERARIO', 168, 2);
      expect(r).toMatchObject({
        totalDevengado: 4_009_095,
        saludEmpleado: 134_400,
        pensionEmpleado: 134_400,
        fsp: 0,
        totalDeducciones: 268_800,
        netoPagar: 3_740_295,
        alertas: [],
      });
    });
    it('CP-02 FSP 1 % = $80.000, neto $7.280.000', () => {
      const r = liquidar('GERENTE', 160, 0);
      expect(r.fsp).toBe(80_000);
      expect(r.netoPagar).toBe(7_280_000);
    });
    it('CP-03 neto $6.396.000', () => {
      expect(liquidar('ADMINISTRADOR', 180, 3).netoPagar).toBe(6_396_000);
    });
    it('CP-04 operario 80 h → alerta "IBC inferior al salario mínimo", neto $1.921.095', () => {
      const r = liquidar('OPERARIO', 80, 1);
      expect(r.netoPagar).toBe(1_921_095);
      expect(r.alertas).toEqual([ALERTA_IBC_INFERIOR_SMMLV]);
    });
    it('CP-07 gerente 180 h → FSP $90.000, neto $8.190.000', () => {
      const r = liquidar('GERENTE', 180, 0);
      expect(r.fsp).toBe(90_000);
      expect(r.netoPagar).toBe(8_190_000);
    });
    it('CP-11a gerente 140 h ($7.000.000 < 4 SMMLV) → FSP $0', () => {
      expect(liquidar('GERENTE', 140, 0).fsp).toBe(0);
    });
    it('CP-11b gerente 141 h ($7.050.000 ≥ 4 SMMLV) → FSP $70.500, neto $6.415.500', () => {
      const r = liquidar('GERENTE', 141, 0);
      expect(r.fsp).toBe(70_500);
      expect(r.netoPagar).toBe(6_415_500);
    });
    it.each([
      [3.99, 0],
      [4, 0.01],
      [16, 0.012],
      [17.5, 0.014],
      [18, 0.016],
      [19.5, 0.018],
      [25, 0.02],
    ])('tasa FSP para %f SMMLV → %f', (smmlv, tasa) => {
      expect(tasaFsp(smmlv, P.fspTramos)).toBe(tasa);
    });
  });

  describe('HU-16 costo del empleador (RN-14)', () => {
    it('CP-01 pensión $403.200, ARL $17.539, caja $134.400, salud/ICBF/SENA exonerados', () => {
      expect(liquidar('OPERARIO', 168, 2)).toMatchObject({
        saludEmpleador: 0,
        pensionEmpleador: 403_200,
        arl: 17_539,
        cajaCompensacion: 134_400,
        icbf: 0,
        sena: 0,
      });
    });
    it('CP-01 cesantías $300.758, intereses $36.091, prima $300.758, vacaciones $140.000', () => {
      expect(liquidar('OPERARIO', 168, 2)).toMatchObject({
        cesantias: 300_758,
        interesesCesantias: 36_091,
        prima: 300_758,
        vacaciones: 140_000,
      });
    });
    it('CP-01 costo empleador total $5.341.841', () => {
      expect(liquidar('OPERARIO', 168, 2).costoEmpleador).toBe(5_341_841);
    });
    it('CP-07 costo empleador total $12.451.980', () => {
      expect(liquidar('GERENTE', 180, 0).costoEmpleador).toBe(12_451_980);
    });
    it('CP-12 IBC ≥ 10 SMMLV (parámetros modificados) → salud 8,5 %, ICBF 3 %, SENA 2 % y FSP 1,2 %', () => {
      const r = calcularLiquidacion(
        { rol: 'GERENTE', horas: 160, hijos: 0, claseRiesgoArl: 1 },
        { ...P, smmlv: 500_000 },
      );
      expect(r).toMatchObject({
        saludEmpleador: 680_000,
        icbf: 240_000,
        sena: 160_000,
        fsp: 96_000,
      });
    });
    it('usa la tarifa ARL de la clase de riesgo', () => {
      expect(liquidar('OPERARIO', 168, 0, { claseRiesgoArl: 5 }).arl).toBe(
        233_856,
      );
    });
    it('rechaza una clase de riesgo ARL inexistente', () => {
      expect(() => liquidar('OPERARIO', 168, 0, { claseRiesgoArl: 9 })).toThrow(
        RangeError,
      );
    });
  });
});
