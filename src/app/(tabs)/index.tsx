import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';
import { useAccountsByOwner } from '@/hooks/useAccounts';
import { useRecentTransactions } from '@/hooks/useTransactions';
import { useAppStore } from '@/store/useAppStore';

import { Avatar } from '@/components/atoms/Avatar';
import { Skeleton, SkeletonRow } from '@/components/atoms/Skeleton';
import { AccountSummary } from '@/components/organisms/AccountSummary';
import { BalanceChart } from '@/components/organisms/BalanceChart';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { ErrorState } from '@/components/organisms/ErrorState';
import { EmptyState } from '@/components/organisms/EmptyState';
import type { Transaction } from '@/domain/entities/Transaction';

const HeaderSkeleton = () => (
  <View className="flex-row items-center justify-between px-4 pt-14 pb-6">
    <View className="gap-2">
      <Skeleton width={90} height={13} borderRadius={6} />
      <Skeleton width={160} height={22} borderRadius={6} />
    </View>
    <Skeleton width={44} height={44} borderRadius={22} />
  </View>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

export default function HomeScreen() {
  const router = useRouter();
  const { activeProfileId, selectedAccountId, setSelectedAccount } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfile();

  const {
    data: accounts,
    isLoading: accountsLoading,
    isError: accountsError,
    refetch: refetchAccounts,
  } = useAccountsByOwner(activeProfileId);

  const {
    data: transactions,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTx,
  } = useRecentTransactions(5);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProfile(), refetchAccounts(), refetchTx()]);
    setRefreshing(false);
  }, [refetchProfile, refetchAccounts, refetchTx]);

  const handlePressTx = (tx: Transaction) => {
    router.push(`/transaction/${tx.id}`);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-dark-bg"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1B4FD8"
          colors={['#1B4FD8']}
        />
      }
    >
      {/* Header */}
      {profileLoading ? (
        <HeaderSkeleton />
      ) : profileError ? (
        <View className="px-4 pt-14 pb-6">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">FinBank</Text>
        </View>
      ) : (
        <View className="flex-row items-center justify-between px-4 pt-14 pb-6">
          <View>
            <Text className="text-sm text-slate-500 dark:text-slate-400">{getGreeting()},</Text>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {profile?.name ?? '—'}
            </Text>
          </View>
          <Avatar uri={profile?.avatar} fallback={profile?.name?.[0]} size="md" />
        </View>
      )}

      {/* Account summary */}
      <View className="mb-6">
        {accountsError ? (
          <ErrorState message="Error al cargar cuentas" onRetry={refetchAccounts} />
        ) : (
          <AccountSummary
            accounts={accounts}
            isLoading={accountsLoading}
            selectedAccountId={selectedAccountId}
            onSelectAccount={setSelectedAccount}
          />
        )}
      </View>

      {/* Balance chart */}
      {!txError && (
        <View className="mb-6">
          <BalanceChart transactions={transactions} isLoading={txLoading} />
        </View>
      )}

      {/* Recent transactions header */}
      <View className="px-4 flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Transacciones recientes
        </Text>
        <Pressable onPress={() => router.push('/search')} hitSlop={8}>
          <Text className="text-sm font-medium text-primary">Ver todas</Text>
        </Pressable>
      </View>

      {/* Transactions */}
      {txLoading ? (
        <View>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : txError ? (
        <ErrorState message="Error al cargar transacciones" onRetry={refetchTx} />
      ) : !transactions?.length ? (
        <EmptyState message="No hay transacciones recientes" />
      ) : (
        <View className="pb-8">
          {transactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} onPress={() => handlePressTx(tx)} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
