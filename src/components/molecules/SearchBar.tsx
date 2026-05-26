import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Buscar transacciones...',
  onClear,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChangeText(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChangeText, value]);

  const handleClear = () => {
    setLocalValue('');
    onChangeText('');
    onClear?.();
  };

  return (
    <View className="flex-row items-center bg-white dark:bg-dark-surface rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 mx-4">
      <Text className="text-slate-400 mr-2">S</Text>
      <TextInput
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="flex-1 text-slate-900 dark:text-white text-sm"
      />
      {localValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-slate-400 font-medium text-sm">x</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
