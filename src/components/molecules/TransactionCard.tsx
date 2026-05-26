import { View, Text, Pressable } from 'react-native';
import type { Transaction } from '@/domain/entities/Transaction';
import { Badge } from '@/components/atoms/Badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

const typeConfig: Record<
  Transaction['type'],
  { badgeVariant: 'success' | 'danger' | 'info'; amountPrefix: string; icon: string; amountColor: string }
> = {
  depósito: { badgeVariant: 'success', amountPrefix: '+', icon: 'D', amountColor: 'text-success' },
  retiro: { badgeVariant: 'danger', amountPrefix: '-', icon: 'R', amountColor: 'text-danger' },
  transferencia: { badgeVariant: 'info', amountPrefix: '', icon: 'T', amountColor: 'text-primary' },
};

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const { badgeVariant, amountPrefix, icon, amountColor } = typeConfig[transaction.type];
  const accountLabel = `${transaction.fromAccountId.slice(-4)} -> ${transaction.toAccountId.slice(-4)}`;

  return (
    <Pressable
      className="flex-row items-center gap-3 px-4 py-3 bg-white dark:bg-dark-surface rounded-xl mx-4 mb-2"
      onPress={onPress}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Text className="text-sm font-bold text-slate-600 dark:text-slate-200">{icon}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-sm font-medium text-slate-900 dark:text-white" numberOfLines={1}>
          {transaction.description}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(transaction.date)}
          </Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500">{accountLabel}</Text>
        </View>
      </View>
      <View className="items-end gap-1">
        <Text className={`text-sm font-semibold ${amountColor}`}>
          {amountPrefix}{formatCurrency(transaction.amount)}
        </Text>
        <Badge label={transaction.type} variant={badgeVariant} />
      </View>
    </Pressable>
  );
};
