const PESOS = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** $ 1.234.567 */
export function pesos(valor: number): string {
  // `|| 0` evita "-$ 0" cuando el valor es -0.
  return PESOS.format(valor || 0);
}

/** 0.04 → "4 %" · 0.00522 → "0,522 %" */
export function porcentaje(fraccion: number): string {
  return `${(fraccion * 100).toLocaleString('es-CO', { maximumFractionDigits: 3 })} %`;
}

/** Fecha ISO (UTC) → 30/10/2026 */
export function fecha(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', { timeZone: 'UTC' });
}

/** Fecha y hora en hora de Colombia. */
export function fechaHora(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
}

export const NOMBRE_ROL_COLABORADOR: Record<string, string> = {
  GERENTE: 'Gerente',
  ADMINISTRADOR: 'Administrador',
  OPERARIO: 'Operario',
};

export const NOMBRE_ROL_USUARIO: Record<string, string> = {
  ADMIN: 'Administrador',
  AUX_CONTABLE: 'Auxiliar contable',
};
