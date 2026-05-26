import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses = 'rounded-xl px-5 py-3 items-center justify-center';
  const widthClass = fullWidth ? 'w-full' : '';

  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    danger: 'bg-danger',
    ghost: 'bg-transparent border border-primary',
  };

  const textClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    danger: 'text-white font-semibold',
    ghost: 'text-primary font-semibold',
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabled || isLoading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#1B4FD8' : '#fff'} />
      ) : (
        <Text className={textClasses[variant]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};
