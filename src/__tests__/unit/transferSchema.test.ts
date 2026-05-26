import { transferSchema } from '@/domain/schemas/transferSchema';

describe('transferSchema', () => {
  it('validates a correct transfer', () => {
    const result = transferSchema.safeParse({
      fromAccountId: 'acc-001',
      toAccountId: 'acc-002',
      amount: 500,
      description: 'Pago servicios',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty fromAccountId', () => {
    const result = transferSchema.safeParse({
      fromAccountId: '',
      toAccountId: 'acc-002',
      amount: 500,
      description: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative amount', () => {
    const result = transferSchema.safeParse({
      fromAccountId: 'acc-001',
      toAccountId: 'acc-002',
      amount: -100,
      description: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 3 chars', () => {
    const result = transferSchema.safeParse({
      fromAccountId: 'acc-001',
      toAccountId: 'acc-002',
      amount: 100,
      description: 'ab',
    });
    expect(result.success).toBe(false);
  });
});
