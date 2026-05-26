import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Transaction } from '@/domain/entities/Transaction';
import { Badge } from '@/components/atoms/Badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface TransactionCardProps {
  transaction: Transaction;
}

const typeConfig: Record<
  Transaction['type'],
  { badgeVariant: 'success' | 'danger' | 'primary'; amountPrefix: string }
> = {
  depósito: { badgeVariant: 'success', amountPrefix: '+' },
  retiro: { badgeVariant: 'danger', amountPrefix: '-' },
  transferencia: { badgeVariant: 'primary', amountPrefix: '' },
};

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const router = useRouter();
  const { badgeVariant, amountPrefix } = typeConfig[transaction.type];

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-dark-surface rounded-xl mx-4 mb-2"
      onPress={() => router.push(`/transaction/${transaction.id}`)}
      activeOpacity={0.7}
    >
      <View className="flex-1 gap-1">
        <Text className="text-sm font-medium text-slate-900 dark:text-white" numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(transaction.date)}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text
          className={`text-sm font-semibold ${
            transaction.type === 'depósito' ? 'text-success' : 'text-danger'
          }`}
        >
          {amountPrefix}{formatCurrency(transaction.amount)}
        </Text>
        <Badge label={transaction.type} variant={badgeVariant} />
      </View>
    </TouchableOpacity>
  );
};
