import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Transaction } from '@/domain/entities/Transaction';
import { useThemeColors } from '@/lib/useThemeColors';

type FilterValue = Transaction['type'] | 'todos';

interface FilterChipProps {
  selected: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Depósitos', value: 'depósito' },
  { label: 'Retiros', value: 'retiro' },
  { label: 'Transferencias', value: 'transferencia' },
];

export const FilterChip = ({ selected, onChange }: FilterChipProps) => {
  const c = useThemeColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.value}
          onPress={() => onChange(f.value)}
          style={[styles.chip, { backgroundColor: c.chipBg, borderColor: c.chipBorder }, selected === f.value && styles.chipActive]}
        >
          <Text style={[styles.label, { color: c.textSecondary }, selected === f.value && styles.labelActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  label: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
  },
});
