import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { formatCurrency } from '@/lib/formatCurrency';

interface AmountInputProps {
  value: number;
  currency?: 'DOP' | 'USD';
  onChangeValue: (value: number) => void;
  label?: string;
}

const currencySymbol: Record<'DOP' | 'USD', string> = {
  DOP: 'RD$ ',
  USD: '$ ',
};

export const AmountInput = ({ value, currency = 'DOP', onChangeValue, label }: AmountInputProps) => {
  const [text, setText] = useState(value ? value.toFixed(2) : '');

  useEffect(() => {
    if (Number(text) !== value) {
      setText(value ? value.toFixed(2) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (input: string) => {
    const normalized = input.replace(',', '.').replace(/[^0-9.]/g, '');
    const parts = normalized.split('.');
    const safe = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : normalized;
    setText(safe);

    const parsed = Number.parseFloat(safe);
    onChangeValue(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <View className="gap-1">
      {label ? <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</Text> : null}
      <View className="flex-row items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface px-4 py-3">
        <Text className="text-slate-500 dark:text-slate-400 mr-2">{currencySymbol[currency]}</Text>
        <TextInput
          value={text}
          onChangeText={handleChange}
          accessibilityLabel={label ?? 'Monto'}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#94a3b8"
          className="flex-1 text-base text-slate-900 dark:text-white"
        />
      </View>
      <Text className="text-xs text-slate-400 dark:text-slate-500">
        {formatCurrency(value, currency)}
      </Text>
    </View>
  );
};
