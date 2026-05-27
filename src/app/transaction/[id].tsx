import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, CheckCircle, Download } from 'lucide-react-native';

import { useTransaction } from '@/hooks/useTransactions';
import { useAccount } from '@/hooks/useAccounts';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ErrorState } from '@/components/organisms/ErrorState';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate, formatDateTime } from '@/lib/formatDate';
import { useThemeColors } from '@/lib/useThemeColors';
import type { Transaction } from '@/domain/entities/Transaction';
import type { Account } from '@/domain/entities/Account';

type TypeCfg = { amountColor: string; prefix: string; label: string; badgeColor: string; badgeBg: string };

const TYPE_CFG: Record<Transaction['type'], TypeCfg> = {
  depósito:      { amountColor: '#10b981', prefix: '+', label: 'Depósito',      badgeColor: '#10b981', badgeBg: 'rgba(16,185,129,0.15)' },
  retiro:        { amountColor: '#ef4444', prefix: '−', label: 'Retiro',        badgeColor: '#ef4444', badgeBg: 'rgba(239,68,68,0.15)'  },
  transferencia: { amountColor: '#3b82f6', prefix: '',  label: 'Transferencia', badgeColor: '#3b82f6', badgeBg: 'rgba(59,130,246,0.15)' },
};

const ScreenSkeleton = () => (
  <View style={styles.root}>
    <View style={styles.skeletonHeader}>
      <Skeleton width={44} height={44} borderRadius={14} />
    </View>
    <View style={styles.skeletonAmountCard}>
      <Skeleton width={120} height={14} borderRadius={6} />
      <Skeleton width={220} height={52} borderRadius={10} />
      <Skeleton width={160} height={13} borderRadius={6} />
    </View>
    <Skeleton width="100%" height={130} borderRadius={20} style={styles.skeletonCard} />
    <Skeleton width="100%" height={110} borderRadius={20} style={styles.skeletonCard} />
    <Skeleton width="100%" height={140} borderRadius={20} style={styles.skeletonCard} />
  </View>
);

interface MiniAccountCardProps {
  account?: Account;
  isLoading: boolean;
  label: string;
}

const MiniAccountCard = ({ account, isLoading, label }: MiniAccountCardProps) => (
  <View style={styles.miniCard}>
    <Text style={styles.miniCardLabel}>{label}</Text>
    {isLoading ? (
      <View style={{ gap: 6, marginTop: 4 }}>
        <Skeleton height={12} borderRadius={4} />
        <Skeleton width={80} height={12} borderRadius={4} />
      </View>
    ) : account ? (
      <>
        <Text style={styles.miniCardType}>{account.type} · {account.currency}</Text>
        <Text style={styles.miniCardNumber}>**** {account.id.slice(-4)}</Text>
        <Text style={styles.miniCardBalance}>{formatCurrency(account.balance, account.currency)}</Text>
      </>
    ) : (
      <Text style={styles.miniCardEmpty}>No disponible</Text>
    )}
  </View>
);

const TimelineStep = ({ label, detail, isLast = false }: { label: string; detail: string; isLast?: boolean }) => (
  <View style={styles.timelineRow}>
    <View style={styles.timelineLeft}>
      <View style={styles.timelineDot}>
        <CheckCircle size={16} color="#10b981" />
      </View>
      {!isLast && <View style={styles.timelineLine} />}
    </View>
    <View style={[styles.timelineContent, !isLast && { paddingBottom: 20 }]}>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={styles.timelineDetail}>{detail}</Text>
    </View>
  </View>
);

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const c = useThemeColors();
  const { data: tx, isLoading: txLoading, isError: txError, refetch } = useTransaction(id);
  const { data: fromAccount, isLoading: fromLoading } = useAccount(tx?.fromAccountId ?? '');
  const { data: toAccount, isLoading: toLoading } = useAccount(tx?.toAccountId ?? '');

  const handleDownloadReceipt = () => {
    if (!tx) return;
    Alert.alert(
      'Recibo de transacción',
      [
        `ID:          ${tx.id}`,
        `Tipo:        ${TYPE_CFG[tx.type].label}`,
        `Monto:       ${TYPE_CFG[tx.type].prefix}${formatCurrency(tx.amount)}`,
        `Fecha:       ${formatDateTime(tx.date)}`,
        `Descripción: ${tx.description}`,
        `Origen:      **** ${tx.fromAccountId.slice(-4)}`,
        `Destino:     **** ${tx.toAccountId.slice(-4)}`,
        `Estado:      Completado`,
      ].join('\n'),
      [{ text: 'Cerrar', style: 'cancel' }],
    );
  };

  if (txLoading) return <ScreenSkeleton />;
  if (txError || !tx) {
    return (
      <View style={[styles.root, { backgroundColor: c.bg, justifyContent: 'center' }]}>
        <ErrorState message="No se pudo cargar la transacción" onRetry={refetch} />
      </View>
    );
  }

  const cfg = TYPE_CFG[tx.type];
  const txDate = new Date(tx.date);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.bg }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0).duration(350)}>
        <View style={styles.header}>
          <Pressable style={[styles.backBtn, { backgroundColor: c.iconBtn, borderColor: c.border }]} onPress={() => router.back()}>
            <ArrowLeft size={22} color="#fff" strokeWidth={2} />
          </Pressable>
          <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
            <Text style={[styles.badgeText, { color: cfg.badgeColor }]}>{cfg.label}</Text>
          </View>
          <View style={styles.backBtn} />
        </View>
      </Animated.View>

      {/* Amount card */}
      <Animated.View entering={FadeInDown.delay(80).duration(350)}>
        <View style={[styles.amountCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={styles.amountLabel}>Monto de la transacción</Text>
          <Text
            style={[styles.amount, { color: cfg.amountColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {cfg.prefix}{formatCurrency(tx.amount)}
          </Text>
          <Text style={styles.amountDate}>{formatDateTime(tx.date)}</Text>
        </View>
      </Animated.View>

      {/* Description + meta */}
      <Animated.View entering={FadeInDown.delay(160).duration(350)}>
        <View style={[styles.card, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Descripción</Text>
            <Text style={styles.cardRowValue}>{tx.description}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>ID transacción</Text>
            <Text style={[styles.cardRowValue, styles.mono]}>{tx.id}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Fecha</Text>
            <Text style={styles.cardRowValue}>{formatDate(tx.date)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Hora</Text>
            <Text style={styles.cardRowValue}>
              {txDate.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Accounts */}
      <Animated.View entering={FadeInDown.delay(240).duration(350)}>
        <View style={[styles.card, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={styles.cardSectionLabel}>Cuentas</Text>
          <View style={styles.accountsRow}>
            <MiniAccountCard account={fromAccount} isLoading={fromLoading} label="Origen" />
            <Text style={styles.arrowSeparator}>→</Text>
            <MiniAccountCard account={toAccount} isLoading={toLoading} label="Destino" />
          </View>
        </View>
      </Animated.View>

      {/* Status timeline */}
      <Animated.View entering={FadeInDown.delay(320).duration(350)}>
        <View style={[styles.card, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={styles.cardSectionLabel}>Estado</Text>
          <TimelineStep label="Iniciado" detail={formatDateTime(tx.date)} />
          <TimelineStep label="Procesado" detail="Verificación completada" />
          <TimelineStep label="Completado" detail="Fondos acreditados" isLast />
        </View>
      </Animated.View>

      {/* Download receipt */}
      <Animated.View entering={FadeInDown.delay(400).duration(350)}>
        <Pressable style={styles.receiptBtn} onPress={handleDownloadReceipt}>
          <Download size={20} color="#3b82f6" strokeWidth={2} />
          <Text style={styles.receiptBtnText}>Descargar recibo</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  skeletonHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  skeletonAmountCard: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  skeletonCard: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  amountCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  amountLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    width: '100%',
    textAlign: 'center',
  },
  amountDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardSectionLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  cardRowLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
  },
  cardRowValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  mono: {
    fontFamily: 'monospace',
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  accountsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 12,
    gap: 3,
  },
  miniCardLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginBottom: 4,
  },
  miniCardType: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  miniCardNumber: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  miniCardBalance: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  miniCardEmpty: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },
  arrowSeparator: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(16,185,129,0.25)',
    marginTop: 4,
    marginBottom: 0,
  },
  timelineContent: {
    flex: 1,
    gap: 2,
  },
  timelineLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timelineDetail: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
    paddingVertical: 16,
    gap: 10,
  },
  receiptBtnText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
  },
});
