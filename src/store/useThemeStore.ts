import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggleTheme: () => set((s) => ({ isDark: !s.isDark })),
  setDark: (value) => set({ isDark: value }),
}));
