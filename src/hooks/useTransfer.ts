import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import { transactionService } from '@/services/transactionService';

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.simulateTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.accounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions] });
    },
  });
};
