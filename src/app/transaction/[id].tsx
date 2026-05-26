import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTransaction } from '@/hooks/useTransactions';
import { useAccount } from '@/hooks/useAccounts';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ErrorState } from '@/components/organisms/ErrorState';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate, formatDateTime } from '@/lib/formatDate';
import type { Transaction } from '@/domain/entities/Transaction';
import type { Account } from '@/domain/entities/Account';

// ─── Type config ────────────────────────────────────────────────────────────

type TypeCfg = {
  badge: 'success' | 'danger' | 'info';
  amountColor: string;
  prefix: string;
  label: string;
};

const TYPE_CFG: Record<Transaction['type'], TypeCfg> = {
  depósito:      { badge: 'success', amountColor: 'text-success',  prefix: '+', label: 'Depósito' },
  retiro:        { badge: 'danger',  amountColor: 'text-danger',   prefix: '−', label: 'Retiro' },
  transferencia: { badge: 'info',    amountColor: 'text-primary',  prefix: '',  label: 'Transferencia' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const ScreenSkeleton = () => (
  <View className="flex-1 bg-slate-50 dark:bg-dark-bg pt-14 px-4 gap-4">
    <Skeleton width={40} height={40} borderRadius={20} />
    <View className="items-center gap-3 py-6">
      <Skeleton width={120} height={16} borderRadius={8} />
      <Skeleton width={200} height={44} borderRadius={10} />
      <Skeleton width={140} height={14} borderRadius={6} />
    </View>
    <Skeleton height={120} borderRadius={16} />
    <Skeleton height={100} borderRadius={16} />
    <Skeleton height={130} borderRadius={16} />
  </View>
);

interface MiniAccountCardProps {
  account?: Account;
  isLoading: boolean;
  label: string;
}

const MiniAccountCard = ({ account, isLoading, label }: MiniAccountCardProps) => (
  <View className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 gap-1">
    <Text className="text-xs text-slate-500 dark:text-slate-400">{label}</Text>
    {isLoading ? (
      <View className="gap-1.5">
        <Skeleton height={12} borderRadius={4} />
        <Skeleton width="60%" height={12} borderRadius={4} />
      </View>
    ) : account ? (
      <>
        <Text className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
          {account.type} · {account.currency}
        </Text>
        <Text className="text-xs font-mono text-slate-500 dark:text-slate-400">
          **** {account.id.slice(-4)}
        </Text>
        <Text className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
          {formatCurrency(account.balance, account.currency)}
        </Text>
      </>
    ) : (
      <Text className="text-xs text-slate-400">Cuenta no encontrada</Text>
    )}
  </View>
);

interface TimelineStepProps {
  label: string;
  detail: string;
  done: boolean;
  isLast?: boolean;
}

const TimelineStep = ({ label, detail, done, isLast = false }: TimelineStepProps) => (
  <View className="flex-row gap-3">
    <View className="items-center">
      <View
        className={`w-7 h-7 rounded-full items-center justify-center ${
          done ? 'bg-success' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <Text className="text-white text-xs font-bold">{done ? '✓' : '·'}</Text>
      </View>
      {!isLast && (
        <View className={`w-0.5 flex-1 mt-1 ${done ? 'bg-success/40' : 'bg-slate-200 dark:bg-slate-700'}`} />
      )}
    </View>
    <View className="pb-5">
      <Text className={`text-sm font-medium ${done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
        {label}
      </Text>
      <Text className="text-xs text-slate-400 dark:text-slate-500">{detail}</Text>
    </View>
  </View>
);

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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
      <View className="flex-1 bg-slate-50 dark:bg-dark-bg pt-14">
        <ErrorState message="No se pudo cargar la transacción" onRetry={refetch} />
      </View>
    );
  }

  const cfg = TYPE_CFG[tx.type];
  const txDate = new Date(tx.date);

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-dark-bg"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* ── Back + type header ── */}
      <Animated.View entering={FadeInDown.delay(0).duration(350)}>
        <View className="flex-row items-center justify-between px-4 pt-14 pb-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-dark-surface"
          >
            <Text className="text-slate-700 dark:text-white text-lg">←</Text>
          </Pressable>
          <Badge label={cfg.label} variant={cfg.badge} />
          <View className="w-10" />
        </View>
      </Animated.View>

      {/* ── Amount card ── */}
      <Animated.View entering={FadeInDown.delay(80).duration(350)}>
        <View className="mx-4 mt-4 bg-white dark:bg-dark-surface rounded-2xl p-6 items-center gap-2">
          <Text className="text-sm text-slate-500 dark:text-slate-400">Monto de la transacción</Text>
          <Text className={`text-5xl font-bold tracking-tight ${cfg.amountColor}`}>
            {cfg.prefix}{formatCurrency(tx.amount)}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {formatDateTime(tx.date)}
          </Text>
        </View>
      </Animated.View>

      {/* ── Description + ID ── */}
      <Animated.View entering={FadeInDown.delay(160).duration(350)}>
        <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl px-5 py-4 gap-3">
          <View className="flex-row justify-between items-start">
            <Text className="text-xs text-slate-500 dark:text-slate-400">Descripción</Text>
            <Text className="text-sm font-medium text-slate-900 dark:text-white flex-1 text-right ml-4">
              {tx.description}
            </Text>
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-800" />
          <View className="flex-row justify-between">
            <Text className="text-xs text-slate-500 dark:text-slate-400">ID transacción</Text>
            <Text className="text-xs font-mono text-slate-700 dark:text-slate-300">{tx.id}</Text>
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-800" />
          <View className="flex-row justify-between">
            <Text className="text-xs text-slate-500 dark:text-slate-400">Fecha</Text>
            <Text className="text-xs text-slate-700 dark:text-slate-300">{formatDate(tx.date)}</Text>
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-800" />
          <View className="flex-row justify-between">
            <Text className="text-xs text-slate-500 dark:text-slate-400">Hora</Text>
            <Text className="text-xs text-slate-700 dark:text-slate-300">
              {txDate.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Accounts: origin → destination ── */}
      <Animated.View entering={FadeInDown.delay(240).duration(350)}>
        <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl px-5 py-4 gap-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Cuentas
          </Text>
          <View className="flex-row items-center gap-3">
            <MiniAccountCard account={fromAccount} isLoading={fromLoading} label="Origen" />
            <Text className="text-slate-400 dark:text-slate-500 text-lg">→</Text>
            <MiniAccountCard account={toAccount} isLoading={toLoading} label="Destino" />
          </View>
        </View>
      </Animated.View>

      {/* ── Status timeline ── */}
      <Animated.View entering={FadeInDown.delay(320).duration(350)}>
        <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl px-5 py-4 gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Estado
          </Text>
          <TimelineStep
            label="Iniciado"
            detail={formatDateTime(tx.date)}
            done
          />
          <TimelineStep
            label="Procesado"
            detail="Verificación completada"
            done
          />
          <TimelineStep
            label="Completado"
            detail="Fondos acreditados"
            done
            isLast
          />
        </View>
      </Animated.View>

      {/* ── Download receipt ── */}
      <Animated.View entering={FadeInDown.delay(400).duration(350)}>
        <View className="mx-4 mt-4">
          <Button label="Descargar recibo" onPress={handleDownloadReceipt} variant="ghost" />
        </View>
      </Animated.View>
    </ScrollView>
  );
}
