import { FlatList, View, Text } from 'react-native';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { SkeletonRow } from '@/components/atoms/Skeleton';
import type { Transaction } from '@/domain/entities/Transaction';

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const TransactionListSkeleton = () => (
  <View>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </View>
);

const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <View className="flex-1 items-center justify-center py-12 gap-3">
    <Text className="text-slate-500 dark:text-slate-400">Error al cargar transacciones</Text>
    {onRetry && (
      <Text className="text-primary font-medium" onPress={onRetry}>
        Reintentar
      </Text>
    )}
  </View>
);

const EmptyState = () => (
  <View className="flex-1 items-center justify-center py-12">
    <Text className="text-slate-400 dark:text-slate-500">No hay transacciones</Text>
  </View>
);

export const TransactionList = ({
  transactions,
  isLoading,
  isError,
  onRetry,
}: TransactionListProps) => {
  if (isLoading) return <TransactionListSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!transactions?.length) return <EmptyState />;

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionCard transaction={item} />}
      contentContainerClassName="pb-4"
      showsVerticalScrollIndicator={false}
    />
  );
};
