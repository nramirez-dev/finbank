import { ScrollView, TouchableOpacity, Text } from 'react-native';
import type { Transaction } from '@/domain/entities/Transaction';

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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.value}
          onPress={() => onChange(f.value)}
          className={`rounded-full px-4 py-1.5 ${
            selected === f.value
              ? 'bg-primary'
              : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selected === f.value ? 'text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
