import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { colorScheme } from 'nativewind';
import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/store/useThemeStore';

export default function RootLayout() {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);

  useEffect(() => {
    colorScheme.set(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
