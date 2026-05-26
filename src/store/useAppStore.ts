import { create } from 'zustand';
import { DEFAULT_PROFILE_ID } from '@/lib/constants';

interface AppStore {
  activeProfileId: string;
  selectedAccountId: string | null;
  setActiveProfile: (id: string) => void;
  setSelectedAccount: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeProfileId: DEFAULT_PROFILE_ID,
  selectedAccountId: null,
  setActiveProfile: (id) => set({ activeProfileId: id }),
  setSelectedAccount: (id) => set({ selectedAccountId: id }),
}));
