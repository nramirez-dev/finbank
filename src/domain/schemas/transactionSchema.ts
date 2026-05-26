import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().min(1, 'Id requerido'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  date: z.string().datetime({ message: 'Fecha inválida' }),
  type: z.enum(['depósito', 'retiro', 'transferencia']),
  fromAccountId: z.string().min(1, 'Selecciona cuenta origen'),
  toAccountId: z.string().min(1, 'Selecciona cuenta destino'),
  description: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
