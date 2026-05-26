import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';

export const useAccounts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.accounts],
    queryFn: () => accountService.getAll(),
    staleTime: STALE_TIME.medium,
  });
};

export const useAccountsByOwner = (ownerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.accounts, ownerId],
    queryFn: () => accountService.getByOwnerId(ownerId),
    staleTime: STALE_TIME.medium,
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.accounts, id],
    queryFn: () => accountService.getById(id),
    staleTime: STALE_TIME.medium,
  });
};
