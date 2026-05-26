import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface ChartDataPoint {
  value: number;
  label?: string;
}

interface BalanceChartProps {
  data: ChartDataPoint[];
  title?: string;
}

export const BalanceChart = ({ data, title = 'Evolución del saldo' }: BalanceChartProps) => {
  return (
    <View className="bg-white dark:bg-dark-surface rounded-2xl p-4 mx-4">
      <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        {title}
      </Text>
      <LineChart
        data={data}
        width={280}
        height={140}
        color="#1B4FD8"
        thickness={2}
        curved
        hideDataPoints={false}
        dataPointsColor="#1B4FD8"
        startFillColor="#1B4FD8"
        endFillColor="rgba(27,79,216,0)"
        areaChart
        yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#94a3b8', fontSize: 10 }}
        noOfSections={4}
        rulesType="solid"
        rulesColor="rgba(148,163,184,0.15)"
      />
    </View>
  );
};
