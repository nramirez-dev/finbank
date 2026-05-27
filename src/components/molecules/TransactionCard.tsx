import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Coffee,
  Gift,
  Home,
  Send,
  ShoppingBag,
  Smartphone,
  Zap,
} from 'lucide-react-native';
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

// Category detection overrides based on description keywords
function getCategoryIcon(description: string): { Icon: typeof ArrowDownLeft; color: string } | null {
  const desc = description.toLowerCase();
  if (/supermercado|compra|tienda|shopping|venta/.test(desc))
    return { Icon: ShoppingBag, color: '#ec4899' };
  if (/electricidad|agua|gas\b|internet|cable|servicio|mantenimiento/.test(desc))
    return { Icon: Zap, color: '#10b981' };
  if (/restaurante|café|cafe|coffee|comida|almuerzo|cena/.test(desc))
    return { Icon: Coffee, color: '#f59e0b' };
  if (/gasolina|uber|taxi|transporte|bus/.test(desc))
    return { Icon: Car, color: '#06b6d4' };
  if (/alquiler|renta/.test(desc))
    return { Icon: Home, color: '#8b5cf6' };
  if (/streaming|software|suscripcion/.test(desc))
    return { Icon: Smartphone, color: '#a78bfa' };
  if (/regalo|gift|bono|reembolso/.test(desc))
    return { Icon: Gift, color: '#f43f5e' };
  return null;
}

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const typeConfig = TYPE_ICON[transaction.type];
  const categoryOverride = getCategoryIcon(transaction.description);
  const Icon = categoryOverride?.Icon ?? typeConfig.Icon;
  const color = categoryOverride?.color ?? typeConfig.color;
  const { amountPrefix } = typeConfig;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: `${color}22` }]}>
        <Icon size={22} color={color} strokeWidth={2} />
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
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
