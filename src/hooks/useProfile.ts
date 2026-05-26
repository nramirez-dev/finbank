import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

export const useProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: () => profileService.getAll(),
    staleTime: STALE_TIME.long,
  });
};

export const useProfile = (id?: string) => {
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const profileId = id ?? activeProfileId;

  return useQuery({
    queryKey: [QUERY_KEYS.profile, profileId],
    queryFn: () => profileService.getById(profileId),
    staleTime: STALE_TIME.long,
  });
};
