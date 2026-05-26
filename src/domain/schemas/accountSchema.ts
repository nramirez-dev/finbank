import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string().min(1),
  balance: z.number(),
  currency: z.enum(['DOP', 'USD']),
  type: z.enum(['ahorros', 'corriente']),
  ownerId: z.string().min(1),
});

export type AccountSchema = z.infer<typeof accountSchema>;
