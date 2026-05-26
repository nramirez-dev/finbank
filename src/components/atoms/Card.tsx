import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  elevated?: boolean;
}

export const Card = ({ children, className, onPress, elevated = false }: CardProps) => {
  const baseClasses = `rounded-2xl bg-white dark:bg-dark-surface ${elevated ? 'shadow-md' : 'shadow-sm'} p-4`;

  if (onPress) {
    return (
      <Pressable className={`${baseClasses} ${className ?? ''}`} onPress={onPress}>
        {children}
      </Pressable>
    );
  }

  return <View className={`${baseClasses} ${className ?? ''}`}>{children}</View>;
};
