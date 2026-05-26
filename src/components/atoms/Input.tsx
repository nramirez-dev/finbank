import { TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  editable?: boolean;
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
}: InputProps) => {
  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        className={`rounded-xl border px-4 py-3 text-slate-900 dark:text-white bg-white dark:bg-dark-surface ${
          error ? 'border-danger' : 'border-slate-200 dark:border-slate-700'
        } ${!editable ? 'opacity-50' : ''}`}
        placeholderTextColor="#94a3b8"
      />
      {error && <Text className="text-xs text-danger">{error}</Text>}
    </View>
  );
};
