import { z } from 'zod';

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Selecciona cuenta origen'),
  toAccountId: z.string().min(1, 'Selecciona cuenta destino'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
});

export type TransferSchema = z.infer<typeof transferSchema>;
