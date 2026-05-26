import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'primary' | 'secondary';
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, { bg: string; text: string }> = {
  success: { bg: 'bg-success/10', text: 'text-success' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
};

export const Badge = ({ label, variant = 'primary' }: BadgeProps) => {
  const { bg, text } = variantMap[variant];
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${bg}`}>
      <Text className={`text-xs font-medium ${text}`}>{label}</Text>
    </View>
  );
};
