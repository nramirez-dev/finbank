import { useQuery } from '@tanstack/react-query';
import { transactionService, type TransactionFilters } from '@/services/transactionService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';

export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.transactions, filters],
    queryFn: () => transactionService.getAll(filters),
    staleTime: STALE_TIME.medium,
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.transactions, id],
    queryFn: () => transactionService.getById(id),
    staleTime: STALE_TIME.medium,
  });
};

export const useRecentTransactions = (limit = 5) => {
  return useQuery({
    queryKey: [QUERY_KEYS.transactions, 'recent', limit],
    queryFn: () => transactionService.getRecent(limit),
    staleTime: STALE_TIME.medium,
  });
};
