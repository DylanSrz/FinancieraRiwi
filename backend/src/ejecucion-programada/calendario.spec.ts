describe('esDiaDeLiquidacion (RN-08, HU-17)', () => {
  it.todo('2026-10-30 19:00 America/Bogota (2026-10-31T00:00Z) → true');
  it.todo('2026-10-29 19:00 America/Bogota → false');
  it.todo('2026-02-28 19:00 America/Bogota (febrero no bisiesto) → true');
  it.todo('2028-02-29 19:00 America/Bogota (bisiesto) → true');
  it.todo(
    '2026-10-31 19:00 America/Bogota (mes de 31 días, ya pasó el 30) → false',
  );
});
