import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemeColors } from '@/lib/useThemeColors';

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
  const c = useThemeColors();

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
    <View style={[styles.container, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
      <Search size={20} color={c.searchIcon} strokeWidth={2} />
      <TextInput
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        placeholderTextColor={c.searchPlaceholder}
        style={[styles.input, { color: c.text }]}
        selectionColor="#3b82f6"
      />
      {localValue.length > 0 && (
        <Pressable onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={16} color={c.textSecondary} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
});
