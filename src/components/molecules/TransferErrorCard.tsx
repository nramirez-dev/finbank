import { Text, View } from 'react-native';
import { Card } from '@/components/atoms/Card';

interface TransferErrorCardProps {
  title?: string;
  message?: string;
}

export const TransferErrorCard = ({
  title = 'Transferencia fallida',
  message = 'No pudimos completar la transferencia. Intenta de nuevo.',
}: TransferErrorCardProps) => {
  return (
    <Card className="border border-danger/30">
      <View className="gap-2">
        <Text className="text-base font-semibold text-danger">{title}</Text>
        <Text className="text-sm text-slate-600 dark:text-slate-300">{message}</Text>
      </View>
    </Card>
  );
};
