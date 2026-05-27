import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import type { Transaction } from '@/domain/entities/Transaction';
import { Skeleton } from '@/components/atoms/Skeleton';

interface BalanceChartProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  title?: string;
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const BalanceChart = ({
  transactions,
  isLoading = false,
  title = 'Ingresos vs gastos (6 meses)',
}: BalanceChartProps) => {
  const { width } = useWindowDimensions();
  // screen width − marginHorizontal (20×2) − card padding (16×2)
  const chartWidth = width - 40 - 32;

  if (isLoading) {
    return <Skeleton height={200} borderRadius={20} style={styles.skeleton} />;
  }

  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTH_LABELS[date.getMonth()],
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  });

  const data = months.flatMap((m) => {
    const monthTx = (transactions ?? []).filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    });

    const income = monthTx
      .filter((t) => t.type === 'depósito')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTx
      .filter((t) => t.type === 'retiro' || t.type === 'transferencia')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { value: income,  label: m.label, frontColor: '#10b981' },
      { value: expense, frontColor: '#ef4444' },
    ];
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={data}
        width={chartWidth}
        height={140}
        barWidth={10}
        spacing={10}
        barBorderRadius={4}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        noOfSections={4}
        rulesType="solid"
        rulesColor="rgba(255,255,255,0.07)"
        backgroundColor="transparent"
        yAxisColor="transparent"
        xAxisColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  title: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  axisText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
  },
});
