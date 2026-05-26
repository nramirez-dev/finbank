import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

export const useAccounts = () => {
  const activeProfileId = useAppStore((s) => s.activeProfileId);

  return useQuery({
    queryKey: [QUERY_KEYS.accounts, activeProfileId],
    queryFn: () => accountService.getByOwnerId(activeProfileId),
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
