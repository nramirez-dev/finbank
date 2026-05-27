import { useThemeStore } from '@/store/useThemeStore';

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
};

const LIGHT = {
  bg: '#F8FAFC',
  surface: '#ffffff',
  surfaceAlt: 'rgba(15,23,42,0.03)',
  border: 'rgba(15,23,42,0.1)',
  text: '#0f172a',
  textSecondary: 'rgba(15,23,42,0.55)',
  textMuted: 'rgba(15,23,42,0.35)',
  inputBg: 'rgba(15,23,42,0.05)',
  iconBtn: 'rgba(15,23,42,0.06)',
  chipBg: 'rgba(15,23,42,0.05)',
  chipBorder: 'rgba(15,23,42,0.1)',
  searchIcon: 'rgba(15,23,42,0.4)',
  searchPlaceholder: 'rgba(15,23,42,0.35)',
  tabBarBg: 'rgba(248,250,252,0.97)',
  tabBarBorder: 'rgba(15,23,42,0.1)',
  tabInactive: 'rgba(15,23,42,0.4)',
  balanceCardGradient: ['#1e40af', '#3b82f6'] as [string, string],
  heroCardGradient: ['#1e40af', '#3b82f6'] as [string, string],
  rowBorder: 'rgba(15,23,42,0.08)',
  txCardBorder: 'rgba(15,23,42,0.06)',
};

export type ThemeColors = typeof DARK;

export const useThemeColors = (): ThemeColors => {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  return isDarkMode ? DARK : LIGHT;
};
