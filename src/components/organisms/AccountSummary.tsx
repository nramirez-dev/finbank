import { ScrollView, View } from 'react-native';
import { AccountCard } from '@/components/molecules/AccountCard';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { Account } from '@/domain/entities/Account';

interface AccountSummaryProps {
  accounts?: Account[];
  isLoading?: boolean;
}

const AccountSummarySkeleton = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 px-4">
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton key={i} width={224} height={112} borderRadius={16} />
    ))}
  </ScrollView>
);

export const AccountSummary = ({ accounts, isLoading }: AccountSummaryProps) => {
  if (isLoading) return <AccountSummarySkeleton />;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 gap-0"
    >
      {accounts?.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </ScrollView>
  );
};
