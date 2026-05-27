import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Send,
  XCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useAccounts, useAccountsByOwner } from '@/hooks/useAccounts';
import { useTransfer } from '@/hooks/useTransfer';
import { useAppStore } from '@/store/useAppStore';
import { transferSchema } from '@/domain/schemas/transferSchema';
import { formatCurrency } from '@/lib/formatCurrency';
import { useThemeColors } from '@/lib/useThemeColors';
import type { Account } from '@/domain/entities/Account';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

const ACCOUNT_GRADIENTS: Record<Account['type'], [string, string]> = {
  corriente: ['#3b82f6', '#1d4ed8'],
  ahorros:   ['#10b981', '#047857'],
};

interface StepIndicatorProps { step: number }
const StepIndicator = ({ step }: StepIndicatorProps) => (
  <View style={styles.stepsIndicator}>
    {[1, 2, 3].map((n, i) => (
      <View key={n} style={styles.stepItem}>
        <View style={[styles.stepDot, step >= n && styles.stepDotActive]}>
          {step > n && <CheckCircle size={10} color="#fff" />}
        </View>
        {i < 2 && <View style={[styles.stepLine, step > n && styles.stepLineActive]} />}
      </View>
    ))}
  </View>
);

interface AccountRowProps {
  account: Account;
  selected: boolean;
  onPress: () => void;
}
const AccountRow = ({ account, selected, onPress }: AccountRowProps) => {
  const c = useThemeColors();
  return (
  <Pressable
    onPress={onPress}
    style={[styles.accountRow, { backgroundColor: c.surfaceAlt, borderColor: c.border }, selected && styles.accountRowSelected]}
  >
    <LinearGradient
      colors={ACCOUNT_GRADIENTS[account.type]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.accountIcon}
    >
      <CreditCard size={18} color="#fff" strokeWidth={2} />
    </LinearGradient>
    <View style={styles.accountInfo}>
      <Text style={styles.accountName}>{account.type} · {account.currency}</Text>
      <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
    </View>
    <Text style={[styles.accountBalance, { color: c.text }]}>{formatCurrency(account.balance, account.currency)}</Text>
    {selected && <View style={styles.selectedDot} />}
  </Pressable>
  );
};

export default function TransferScreen() {
  const router = useRouter();
  const { activeProfileId } = useAppStore();
  const c = useThemeColors();
  const { data: ownAccounts = [] } = useAccountsByOwner(activeProfileId);
  const { data: allAccounts = [] } = useAccounts();
  const transfer = useTransfer();

  const [step, setStep] = useState(1);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [step1Error, setStep1Error] = useState('');
  const [step2Error, setStep2Error] = useState('');

  const fromAccount = allAccounts.find((a) => a.id === fromId);
  const toAccount = allAccounts.find((a) => a.id === toId);
  const amountNum = parseFloat(amount.replace(',', '.')) || 0;

  const handleConfirm = () => {
    const result = transferSchema.safeParse({
      fromAccountId: fromId,
      toAccountId: toId,
      amount: amountNum,
      description: description.trim(),
    });
    if (!result.success) return;
    transfer.mutate(result.data, {
      onSuccess: () => setStep(4),
      onError: () => setStep(5),
    });
  };

  const handleReset = () => {
    setStep(1);
    setFromId('');
    setToId('');
    setAmount('');
    setDescription('');
    setStep1Error('');
    setStep2Error('');
    transfer.reset();
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <View style={[styles.resultScreen, { backgroundColor: c.bg }]}>
        <View style={styles.resultIcon}>
          <CheckCircle size={72} color="#10b981" strokeWidth={1.5} />
        </View>
        <Text style={styles.resultTitle}>¡Transferencia exitosa!</Text>
        <Text style={styles.resultSubtitle}>
          {formatCurrency(amountNum)} enviado correctamente
        </Text>
        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>De</Text>
            <Text style={styles.resultValue}>{fromAccount?.type} **** {fromAccount?.id.slice(-4)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Para</Text>
            <Text style={styles.resultValue}>{toAccount?.type} **** {toAccount?.id.slice(-4)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Descripción</Text>
            <Text style={styles.resultValue}>{description}</Text>
          </View>
        </View>
        <Pressable style={styles.successBtn} onPress={handleReset}>
          <Text style={styles.successBtnText}>Nueva transferencia</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/')} hitSlop={8}>
          <Text style={styles.linkText}>Ir al inicio</Text>
        </Pressable>
      </View>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <View style={[styles.resultScreen, { backgroundColor: c.bg }]}>
        <View style={styles.resultIcon}>
          <XCircle size={72} color="#ef4444" strokeWidth={1.5} />
        </View>
        <Text style={[styles.resultTitle, { color: '#ef4444' }]}>Error en la transferencia</Text>
        <Text style={styles.resultSubtitle}>No se pudo completar la operación</Text>
        <Pressable style={styles.retryBtn} onPress={() => setStep(3)}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </Pressable>
        <Pressable onPress={handleReset} hitSlop={8}>
          <Text style={styles.linkText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: c.iconBtn, borderColor: c.border }]}
          onPress={step === 1 ? () => router.back() : () => setStep((s) => s - 1)}
        >
          <ArrowLeft size={22} color="#fff" strokeWidth={2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: c.text }]}>Transferir</Text>
        <View style={[styles.backBtn, { backgroundColor: c.iconBtn, borderColor: c.border }]} />
      </View>

      <StepIndicator step={step} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step 1: From account + amount ── */}
          {step === 1 && (
            <>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Cuenta origen</Text>
              {ownAccounts.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  selected={fromId === a.id}
                  onPress={() => setFromId(a.id)}
                />
              ))}

              <Text style={[styles.sectionTitle, { marginTop: 28, color: c.text }]}>Monto</Text>
              <View style={[styles.amountRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                <Text style={styles.currencyPrefix}>RD$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="decimal-pad"
                  selectionColor="#3b82f6"
                />
              </View>

              <View style={styles.quickAmounts}>
                {QUICK_AMOUNTS.map((v) => (
                  <Pressable key={v} style={styles.quickBtn} onPress={() => setAmount(String(v))}>
                    <Text style={styles.quickBtnText}>RD${v.toLocaleString()}</Text>
                  </Pressable>
                ))}
              </View>

              {step1Error ? <Text style={styles.errorText}>{step1Error}</Text> : null}

              <Pressable
                onPress={() => {
                  if (!fromId) { setStep1Error('Selecciona una cuenta origen'); return; }
                  if (amountNum <= 0) { setStep1Error('El monto debe ser mayor a 0'); return; }
                  setStep1Error('');
                  setStep(2);
                }}
                style={{ marginTop: 8, marginBottom: 32 }}
              >
                <LinearGradient
                  colors={fromId && amountNum > 0 ? ['#3b82f6', '#2563eb'] : ['#334155', '#334155']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.nextBtn}
                >
                  <Text style={styles.nextBtnText}>Continuar</Text>
                  <ChevronRight size={20} color="#fff" strokeWidth={2} />
                </LinearGradient>
              </Pressable>
            </>
          )}

          {/* ── Step 2: To account + description ── */}
          {step === 2 && (
            <>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Cuenta destino</Text>
              {allAccounts
                .filter((a) => a.id !== fromId)
                .map((a) => (
                  <AccountRow
                    key={a.id}
                    account={a}
                    selected={toId === a.id}
                    onPress={() => setToId(a.id)}
                  />
                ))}

              <Text style={[styles.sectionTitle, { marginTop: 28, color: c.text }]}>Descripción</Text>
              <View style={[styles.descriptionInput, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                <TextInput
                  style={styles.descriptionTextInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Ej: Pago de alquiler"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  selectionColor="#3b82f6"
                  maxLength={100}
                />
              </View>
              <Text style={styles.charCount}>{description.length}/100</Text>

              {step2Error ? <Text style={styles.errorText}>{step2Error}</Text> : null}

              <Pressable
                onPress={() => {
                  if (!toId) { setStep2Error('Selecciona una cuenta destino'); return; }
                  if (description.trim().length < 3) { setStep2Error('La descripción debe tener al menos 3 caracteres'); return; }
                  setStep2Error('');
                  setStep(3);
                }}
                style={{ marginTop: 16, marginBottom: 32 }}
              >
                <LinearGradient
                  colors={toId && description.trim().length >= 3 ? ['#3b82f6', '#2563eb'] : ['#334155', '#334155']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.nextBtn}
                >
                  <Text style={styles.nextBtnText}>Continuar</Text>
                  <ChevronRight size={20} color="#fff" strokeWidth={2} />
                </LinearGradient>
              </Pressable>
            </>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Confirmación</Text>

              <View style={[styles.confirmCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
                <View style={styles.confirmAmountBox}>
                  <Text style={styles.confirmAmountLabel}>Vas a transferir</Text>
                  <Text style={styles.confirmAmount}>RD${amountNum.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>De</Text>
                  <Text style={styles.confirmValue}>{fromAccount?.type} **** {fromAccount?.id.slice(-4)}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Para</Text>
                  <Text style={styles.confirmValue}>{toAccount?.type} **** {toAccount?.id.slice(-4)}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Descripción</Text>
                  <Text style={[styles.confirmValue, { flex: 1, textAlign: 'right', marginLeft: 16 }]}>{description}</Text>
                </View>
              </View>

              <View style={{ height: 120 }} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky confirm button */}
      {step === 3 && (
        <View style={[styles.stickyFooter, { backgroundColor: c.bg }]}>
          <Pressable onPress={handleConfirm} disabled={transfer.isPending}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.confirmBtn, transfer.isPending && { opacity: 0.7 }]}
            >
              <Send size={20} color="#fff" strokeWidth={2} />
              <Text style={styles.confirmBtnText}>
                {transfer.isPending ? 'Procesando...' : 'Confirmar transferencia'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 0,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#3b82f6',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepLine: {
    width: 56,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: '#3b82f6',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  accountRowSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 3,
  },
  accountNumber: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  accountBalance: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 24,
    height: 84,
    marginBottom: 16,
  },
  currencyPrefix: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 28,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#fff',
    fontSize: 42,
    fontWeight: '700',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 6,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  descriptionInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  descriptionTextInput: {
    color: '#fff',
    fontSize: 16,
  },
  charCount: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
  confirmCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    gap: 14,
  },
  confirmAmountBox: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  confirmAmountLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 8,
  },
  confirmAmount: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
  confirmValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 110 : 100,
    paddingTop: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 10,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4,
  },
  // Result screens
  resultScreen: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  resultIcon: {
    marginBottom: 8,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    textAlign: 'center',
  },
  resultCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    gap: 14,
    marginTop: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  resultValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  successBtn: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  successBtnText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '700',
  },
  retryBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  retryBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontWeight: '500',
  },
});
