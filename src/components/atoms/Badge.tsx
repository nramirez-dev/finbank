import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, { bg: string; text: string }> = {
  success: { bg: 'bg-success/10', text: 'text-success' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  info: { bg: 'bg-secondary/10', text: 'text-secondary' },
  neutral: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-200' },
};

export const Badge = ({ label, variant = 'info' }: BadgeProps) => {
  const { bg, text } = variantMap[variant];
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${bg}`}>
      <Text className={`text-xs font-medium ${text}`}>{label}</Text>
    </View>
  );
};
