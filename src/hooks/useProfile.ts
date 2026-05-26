import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

export const useProfile = () => {
  const activeProfileId = useAppStore((s) => s.activeProfileId);

  return useQuery({
    queryKey: [QUERY_KEYS.profile, activeProfileId],
    queryFn: () => profileService.getById(activeProfileId),
    staleTime: STALE_TIME.long,
  });
};
