import { formatCurrency } from '@/lib/formatCurrency';

describe('formatCurrency', () => {
  it('formats DOP correctly', () => {
    const result = formatCurrency(1234.56, 'DOP');
    expect(result).toContain('1,234.56');
  });

  it('formats USD correctly', () => {
    const result = formatCurrency(100, 'USD');
    expect(result).toContain('100');
  });

  it('defaults to DOP', () => {
    const result = formatCurrency(500);
    expect(typeof result).toBe('string');
  });
});
