import { useState, useCallback } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useResponsive } from '@/lib/useResponsive';
import { Bell, Search } from 'lucide-react-native';

import { useProfile } from '@/hooks/useProfile';
import { useAccountsByOwner } from '@/hooks/useAccounts';
import { useRecentTransactions } from '@/hooks/useTransactions';
import { useAppStore } from '@/store/useAppStore';

import { Skeleton, SkeletonRow } from '@/components/atoms/Skeleton';
import { AccountSummary } from '@/components/organisms/AccountSummary';
import { BalanceChart } from '@/components/organisms/BalanceChart';
import { QuickActions } from '@/components/organisms/QuickActions';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { ErrorState } from '@/components/organisms/ErrorState';
import { EmptyState } from '@/components/organisms/EmptyState';
import type { Transaction } from '@/domain/entities/Transaction';

const HeaderSkeleton = () => (
  <View style={styles.headerRow}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={{ gap: 6 }}>
        <Skeleton width={80} height={12} borderRadius={4} />
        <Skeleton width={140} height={18} borderRadius={4} />
      </View>
    </View>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Skeleton width={44} height={44} borderRadius={14} />
      <Skeleton width={44} height={44} borderRadius={14} />
    </View>
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
  const { px, fontScale } = useResponsive();

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
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        {/* ── Header ── */}
        <View style={[styles.headerArea, { paddingHorizontal: px }]}>
          {profileLoading ? (
            <HeaderSkeleton />
          ) : profileError ? (
            <View style={styles.headerRow}>
              <Text style={styles.userName}>FinBank</Text>
            </View>
          ) : (
            <View style={styles.headerRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {profile?.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarLetter}>{profile?.name?.[0] ?? 'U'}</Text>
                  </View>
                )}
                <View>
                  <Text style={[styles.greeting, { fontSize: 13 + fontScale }]}>{getGreeting()}</Text>
                  <Text style={[styles.userName, { fontSize: 18 + fontScale }]}>{profile?.name ?? '—'}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable style={styles.iconButton} onPress={() => router.push('/search')}>
                  <Search size={20} color="#fff" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <Bell size={20} color="#fff" />
                  <View style={styles.notificationDot} />
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* ── Account summary ── */}
        <View style={styles.section}>
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

        {/* ── Quick actions ── */}
        <QuickActions />

        {/* ── Balance chart ── */}
        {!txError && (
          <View style={styles.section}>
            <BalanceChart transactions={transactions} isLoading={txLoading} />
          </View>
        )}

        {/* ── Recent transactions ── */}
        <View style={[styles.sectionHeader, { paddingHorizontal: px }]}>
          <Text style={[styles.sectionTitle, { fontSize: 18 + fontScale }]}>Transacciones recientes</Text>
          <Pressable onPress={() => router.push('/search')} hitSlop={8}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </Pressable>
        </View>

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
          <View style={[styles.txCard, { marginHorizontal: px }]}>
            {transactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} onPress={() => handlePressTx(tx)} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    flex: 1,
  },
  headerArea: {
    paddingTop: 56,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#3b82f6',
    fontSize: 20,
    fontWeight: '700',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.48)',
    fontSize: 13,
    marginBottom: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  txCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
});
