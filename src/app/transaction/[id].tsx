import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-surface dark:bg-dark-bg">
      <Text className="text-xl font-bold text-primary">Transacción {id}</Text>
    </View>
  );
}
