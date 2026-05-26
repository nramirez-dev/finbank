export function formatCurrency(amount: number, currency: 'DOP' | 'USD' = 'DOP'): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
