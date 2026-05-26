import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number(),
  date: z.string().datetime(),
  type: z.enum(['depósito', 'retiro', 'transferencia']),
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  description: z.string().min(1).max(100),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
