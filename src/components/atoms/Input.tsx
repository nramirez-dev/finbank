import type { ReactNode } from 'react';
import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  leftIcon,
  rightIcon,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showFloatingLabel = Boolean(label) && (isFocused || value.length > 0);

  return (
    <View className="gap-1">
      <View
        className={`relative rounded-xl border bg-white dark:bg-dark-surface ${
          error ? 'border-danger' : 'border-slate-200 dark:border-slate-700'
        } ${!editable ? 'opacity-50' : ''}`}
      >
        {label ? (
          <Text
            className={`absolute left-4 ${
              showFloatingLabel
                ? '-top-2 px-1 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-surface'
                : 'top-3 text-sm text-slate-400'
            }`}
          >
            {label}
          </Text>
        ) : null}
        <View className={`flex-row items-center px-4 ${label ? 'pt-4 pb-3' : 'py-3'}`}>
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={label ? undefined : placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 text-base text-slate-900 dark:text-white"
            placeholderTextColor="#94a3b8"
          />
          {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
        </View>
      </View>
      {error && <Text className="text-xs text-danger">{error}</Text>}
    </View>
  );
};
