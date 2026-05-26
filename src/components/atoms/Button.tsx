import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
}: ButtonProps) => {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;
  const baseClasses = 'w-full rounded-xl items-center justify-center';

  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary dark:bg-primary',
    secondary: 'bg-secondary dark:bg-secondary',
    danger: 'bg-danger dark:bg-danger',
    ghost: 'bg-transparent border border-primary dark:border-secondary',
  };

  const textClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    danger: 'text-white font-semibold',
    ghost: 'text-primary font-semibold',
  };

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, { container: string; text: string }> = {
    sm: { container: 'px-3 py-2', text: 'text-sm' },
    md: { container: 'px-5 py-3', text: 'text-base' },
    lg: { container: 'px-6 py-4', text: 'text-lg' },
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withTiming(0.97, { duration: 120 });
    }
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const sizeConfig = sizeClasses[size];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <Animated.View
        style={animatedStyle}
        className={`${baseClasses} ${sizeConfig.container} ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : ''}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'ghost' ? '#1B4FD8' : '#fff'} />
        ) : (
          <View className="flex-row items-center gap-2">
            {leftIcon ? <View className="mr-1">{leftIcon}</View> : null}
            <Text className={`${textClasses[variant]} ${sizeConfig.text}`}>{label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
