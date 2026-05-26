import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Send } from 'lucide-react-native';
import type { Transaction } from '@/domain/entities/Transaction';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

type IconCfg = {
  Icon: typeof ArrowDownLeft;
  color: string;
  amountPrefix: string;
};

const TYPE_ICON: Record<Transaction['type'], IconCfg> = {
  depósito:      { Icon: ArrowDownLeft, color: '#10b981', amountPrefix: '+' },
  retiro:        { Icon: ArrowUpRight,  color: '#ef4444', amountPrefix: '−' },
  transferencia: { Icon: Send,          color: '#3b82f6', amountPrefix: ''  },
};

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const { Icon, color, amountPrefix } = TYPE_ICON[transaction.type];

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: `${color}22` }]}>
        <Icon size={22} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      <Text style={[styles.amount, { color }]}>
        {amountPrefix}{formatCurrency(transaction.amount)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  description: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.42)',
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
