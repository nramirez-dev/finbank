import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface FilterChipsProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export const FilterChips = ({ options, selected, onToggle }: FilterChipsProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onToggle(option)}
            className={`rounded-full px-4 py-1.5 ${
              isActive
                ? 'bg-primary'
                : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
