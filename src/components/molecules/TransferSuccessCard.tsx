import { Text, View } from 'react-native';
import { Card } from '@/components/atoms/Card';

interface TransferSuccessCardProps {
  title?: string;
  message?: string;
}

export const TransferSuccessCard = ({
  title = 'Transferencia exitosa',
  message = 'Tu transferencia se proceso correctamente.',
}: TransferSuccessCardProps) => {
  return (
    <Card className="border border-success/30">
      <View className="gap-2">
        <Text className="text-base font-semibold text-success">{title}</Text>
        <Text className="text-sm text-slate-600 dark:text-slate-300">{message}</Text>
      </View>
    </Card>
  );
};
