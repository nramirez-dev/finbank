import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string().min(1, 'Id requerido'),
  balance: z.number().min(0, 'El balance no puede ser negativo'),
  currency: z.enum(['DOP', 'USD']),
  type: z.enum(['ahorros', 'corriente']),
  ownerId: z.string().min(1, 'OwnerId requerido'),
});

export type AccountSchema = z.infer<typeof accountSchema>;
