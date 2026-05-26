import type { ReactNode } from 'react';
import { Text as RNText } from 'react-native';

interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  weight?: string;
  className?: string;
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  caption: 'text-xs',
  label: 'text-sm font-medium',
};

export const Text = ({
  children,
  variant = 'body',
  color = 'text-slate-900 dark:text-white',
  weight,
  className,
}: TextProps) => {
  const base = variantClasses[variant];
  const weightClass = weight ?? '';

  return <RNText className={`${base} ${color} ${weightClass} ${className ?? ''}`}>{children}</RNText>;
};
