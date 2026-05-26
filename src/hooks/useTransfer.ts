import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TransferSchema } from '@/domain/schemas/transferSchema';
import { QUERY_KEYS } from '@/lib/constants';

const simulateTransfer = async (data: TransferSchema): Promise<void> => {
  // Simulated async transfer — replace with real API call
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
  if (data.fromAccountId === data.toAccountId) {
    throw new Error('La cuenta origen y destino no pueden ser la misma');
  }
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulateTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.accounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions] });
    },
  });
};
