import '../global.css';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme } from 'nativewind';
import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/store/useThemeStore';

export default function RootLayout() {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);

  colorScheme.set(isDarkMode ? 'dark' : 'light');

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
