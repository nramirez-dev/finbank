import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react-native';
import { AccountCard } from '@/components/molecules/AccountCard';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { Account } from '@/domain/entities/Account';
import { formatCurrency } from '@/lib/formatCurrency';
import { useThemeColors } from '@/lib/useThemeColors';

interface AccountSummaryProps {
  accounts?: Account[];
  isLoading?: boolean;
  selectedAccountId?: string | null;
  onSelectAccount?: (accountId: string | null) => void;
}

const AccountSummarySkeleton = () => (
  <View style={styles.skeletonWrapper}>
    <Skeleton width="100%" height={148} borderRadius={20} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContent}>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} width={272} height={162} borderRadius={20} />
      ))}
    </ScrollView>
  </View>
);

export const AccountSummary = ({
  accounts,
  isLoading,
  selectedAccountId,
  onSelectAccount,
}: AccountSummaryProps) => {
  const [showBalance, setShowBalance] = useState(true);
  const c = useThemeColors();

  if (isLoading) return <AccountSummarySkeleton />;

  const totals = (accounts ?? []).reduce(
    (acc, account) => {
      if (account.currency === 'USD') {
        acc.usd += account.balance;
      } else {
        acc.dop += account.balance;
      }
      return acc;
    },
    { dop: 0, usd: 0 },
  );

  const accountCount = accounts?.length ?? 0;

  return (
    <View style={styles.wrapper}>
      {/* Balance card */}
      <LinearGradient
        colors={c.balanceCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>SALDO TOTAL</Text>
          <Pressable style={styles.balanceRow} onPress={() => setShowBalance((v) => !v)}>
            <Text
              style={styles.balanceAmount}
              adjustsFontSizeToFit
              numberOfLines={1}
              minimumFontScale={0.5}
            >
              {showBalance ? formatCurrency(totals.dop, 'DOP') : '••••••'}
            </Text>
            <View style={styles.eyeButton}>
              {showBalance
                ? <Eye size={20} color="rgba(255,255,255,0.5)" />
                : <EyeOff size={20} color="rgba(255,255,255,0.5)" />}
            </View>
          </Pressable>
          {totals.usd > 0 && (
            <Text style={styles.balanceSecondary}>
              {showBalance ? formatCurrency(totals.usd, 'USD') : '••••'}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <TrendingUp size={16} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.statLabel}>Cuentas</Text>
              <Text style={styles.statValue}>
                {accountCount} activa{accountCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Wallet size={16} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.statLabel}>Monedas</Text>
              <Text style={styles.statValue}>
                {totals.usd > 0 ? 'DOP · USD' : 'DOP'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Account cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {accounts?.map((account) => {
          const isSelected = selectedAccountId === account.id;
          return (
            <AccountCard
              key={account.id}
              account={account}
              isSelected={isSelected}
              onPress={() => onSelectAccount?.(isSelected ? null : account.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  skeletonWrapper: {
    gap: 16,
    paddingHorizontal: 20,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 22,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  balanceHeader: {
    marginBottom: 18,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    marginLeft: 12,
    padding: 4,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
    flex: 1,
  },
  balanceSecondary: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardsContent: {
    paddingHorizontal: 20,
  },
});
