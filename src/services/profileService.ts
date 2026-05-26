import type { UserProfile } from '@/domain/entities/UserProfile';
import profilesData from '@/data/profiles.json';

const profiles = profilesData as UserProfile[];

export const profileService = {
  getById: async (id: string): Promise<UserProfile> => {
    const profile = profiles.find((p) => p.id === id);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  },

  getAll: async (): Promise<UserProfile[]> => {
    return profiles;
  },
};
