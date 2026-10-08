/**
 * Casos de prueba del motor (docs/requerimientos/04-reglas-de-negocio.md, sección "Casos de prueba").
 * Cada `it.todo` se convierte en prueba real en la historia indicada.
 */
describe('calcularLiquidacion', () => {
  describe('HU-12 devengado básico (RN-01..03, RN-07)', () => {
    it.todo('CP-01 operario 168 h → básico $3.360.000');
    it.todo('CP-02 gerente 160 h → básico $8.000.000');
    it.todo('CP-03 administrador 180 h → básico $6.300.000');
  });

  describe('HU-13 bonificación por hijos (RN-04..06)', () => {
    it.todo('0 hijos → $0');
    it.todo('1 hijo → $200.000; 2 hijos → $400.000; 3 hijos → $600.000');
    it.todo(
      'CP-05 operario 100 h, 5 hijos → bonificación $600.000 (tope 3 o más), neto $2.689.095',
    );
    it.todo('la bonificación no hace parte del IBC');
  });

  describe('HU-14 auxilio de transporte (RN-09)', () => {
    it.todo('CP-01 básico $3.360.000 ≤ 2 SMMLV → auxilio $249.095');
    it.todo('CP-02 básico $8.000.000 > 2 SMMLV → auxilio $0');
    it.todo(
      'básico exactamente igual a 2 SMMLV ($3.501.810) → sí recibe auxilio',
    );
  });

  describe('HU-15 deducciones (RN-10..13)', () => {
    it.todo('CP-01 salud $134.400, pensión $134.400, FSP $0, neto $3.740.295');
    it.todo('CP-02 FSP 1 % = $80.000, neto $7.280.000');
    it.todo('CP-03 neto $6.396.000');
    it.todo(
      'CP-04 operario 80 h → alerta "IBC inferior al salario mínimo", neto $1.921.095',
    );
  });

  describe('HU-16 costo del empleador (RN-14)', () => {
    it.todo(
      'CP-01 pensión $403.200, ARL $17.539, caja $134.400, salud/ICBF/SENA exonerados',
    );
    it.todo(
      'CP-01 cesantías $300.758, intereses $36.091, prima $300.758, vacaciones $140.000',
    );
    it.todo('CP-01 costo empleador total $5.341.841');
    it.todo('CP-07 costo empleador total $12.451.980');
    it.todo(
      'CP-12 IBC ≥ 10 SMMLV (parámetros modificados) → salud 8,5 %, ICBF 3 %, SENA 2 % y FSP 1,2 %',
    );
  });
});
