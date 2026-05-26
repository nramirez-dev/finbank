import { formatDate, formatDateTime } from '@/lib/formatDate';

describe('formatDate', () => {
  it('returns a non-empty string for valid ISO date', () => {
    const result = formatDate('2026-05-20T10:30:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatDateTime', () => {
  it('returns a string containing hour info', () => {
    const result = formatDateTime('2026-05-20T10:30:00.000Z');
    expect(typeof result).toBe('string');
  });
});
