import type { UserProfile } from '@/domain/entities/UserProfile';
import profilesData from '@/data/profiles.json';

const profiles = profilesData as UserProfile[];

export const profileService = {
  getById: async (id: string): Promise<UserProfile | undefined> => {
    return profiles.find((p) => p.id === id);
  },

  getAll: async (): Promise<UserProfile[]> => {
    return profiles;
  },
};
