import { useThemeStore } from '@/store/useThemeStore';

interface CardShadow {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
}

const NO_SHADOW: CardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
};

const CARD_SHADOW: CardShadow = {
  shadowColor: '#64748b',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
};

const DARK = {
  bg: '#0f172a',
  surface: '#1e293b',
  surfaceAlt: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.35)',
  inputBg: 'rgba(255,255,255,0.05)',
  iconBtn: 'rgba(255,255,255,0.06)',
  chipBg: 'rgba(255,255,255,0.06)',
  chipBorder: 'rgba(255,255,255,0.08)',
  searchIcon: 'rgba(255,255,255,0.4)',
  searchPlaceholder: 'rgba(255,255,255,0.35)',
  tabBarBg: 'rgba(15,23,42,0.97)',
  tabBarBorder: 'rgba(255,255,255,0.08)',
  tabInactive: 'rgba(255,255,255,0.4)',
  balanceCardGradient: ['#0f172a', '#1e293b'] as [string, string],
  heroCardGradient: ['#1e293b', '#0f172a'] as [string, string],
  rowBorder: 'rgba(255,255,255,0.08)',
  txCardBorder: 'rgba(255,255,255,0.05)',
  cardShadow: NO_SHADOW,
};

const LIGHT = {
  bg: '#F1F5F9',
  surface: '#ffffff',
  surfaceAlt: '#ffffff',
  border: '#E2E8F0',
  text: '#0f172a',
  textSecondary: 'rgba(15,23,42,0.55)',
  textMuted: 'rgba(15,23,42,0.35)',
  inputBg: '#ffffff',
  iconBtn: '#E2E8F0',
  chipBg: '#E2E8F0',
  chipBorder: '#E2E8F0',
  searchIcon: 'rgba(15,23,42,0.4)',
  searchPlaceholder: 'rgba(15,23,42,0.35)',
  tabBarBg: '#ffffff',
  tabBarBorder: '#E2E8F0',
  tabInactive: 'rgba(15,23,42,0.4)',
  balanceCardGradient: ['#1e40af', '#3b82f6'] as [string, string],
  heroCardGradient: ['#1e40af', '#3b82f6'] as [string, string],
  rowBorder: '#E2E8F0',
  txCardBorder: '#E2E8F0',
  cardShadow: CARD_SHADOW,
};

export type ThemeColors = typeof DARK;

export const useThemeColors = (): ThemeColors => {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  return isDarkMode ? DARK : LIGHT;
};
