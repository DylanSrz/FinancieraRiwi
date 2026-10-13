/** Convierte un Decimal de Prisma (o null) a number. Los montos de nómina caben sin pérdida en un double. */
export function aNumero(
  valor: { toNumber(): number } | number | null | undefined,
): number {
  if (valor === null || valor === undefined) return 0;
  return typeof valor === 'number' ? valor : valor.toNumber();
}
