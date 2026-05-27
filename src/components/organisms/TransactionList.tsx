import { FlatList, StyleSheet, View } from 'react-native';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { SkeletonRow } from '@/components/atoms/Skeleton';
import type { Transaction } from '@/domain/entities/Transaction';
import { ErrorState } from '@/components/organisms/ErrorState';
import { EmptyState } from '@/components/organisms/EmptyState';

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
  onLoadMore?: () => void;
  onPressItem?: (transaction: Transaction) => void;
}

const TransactionListSkeleton = () => (
  <View>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </View>
);

export const TransactionList = ({
  transactions,
  isLoading,
  isError,
  onRefetch,
  onLoadMore,
  onPressItem,
}: TransactionListProps) => {
  if (isLoading) return <TransactionListSkeleton />;
  if (isError) return <ErrorState message="Error al cargar transacciones" onRetry={onRefetch} />;
  if (!transactions?.length) return <EmptyState message="No hay transacciones" />;

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard
          transaction={item}
          onPress={() => onPressItem?.(item)}
        />
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
    backgroundColor: '#0f172a',
  },
});
