import { View, TextInput, TouchableOpacity, Text } from 'react-native';

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
  return (
    <View className="flex-row items-center bg-white dark:bg-dark-surface rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 mx-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="flex-1 text-slate-900 dark:text-white text-sm"
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-slate-400 font-medium text-sm">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
