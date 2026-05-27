import { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferSchema, type TransferSchema } from '@/domain/schemas/transferSchema';
import type { Account } from '@/domain/entities/Account';
import { AccountCard } from '@/components/molecules/AccountCard';
import { AmountInput } from '@/components/molecules/AmountInput';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { TransferErrorCard } from '@/components/molecules/TransferErrorCard';
import { TransferSuccessCard } from '@/components/molecules/TransferSuccessCard';

interface TransferFormProps {
  onSubmit: (data: TransferSchema) => void;
  isSubmitting?: boolean;
  accounts: Account[];
}

export const TransferForm = ({ onSubmit, isSubmitting = false, accounts }: TransferFormProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<TransferSchema | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: '',
      toAccountId: '',
      amount: 0,
      description: '',
    },
  });

  const fromAccountId = watch('fromAccountId');
  const toAccountId = watch('toAccountId');

  const selectedFrom = useMemo(
    () => accounts.find((account) => account.id === fromAccountId),
    [accounts, fromAccountId]
  );
  const selectedTo = useMemo(
    () => accounts.find((account) => account.id === toAccountId),
    [accounts, toAccountId]
  );

  const handlePrepareSubmit = handleSubmit((data) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  });

  const handleConfirm = async () => {
    if (!pendingData) return;
    setIsConfirming(true);
    setIsConfirmOpen(false);
    setStatus('idle');
    setStatusMessage(undefined);

    try {
      await Promise.resolve(onSubmit(pendingData));
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'No se pudo procesar la transferencia');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <View className="gap-4 px-4">
      <Text className="text-lg font-bold text-slate-900 dark:text-white">Nueva transferencia</Text>

      <Controller
        control={control}
        name="fromAccountId"
        render={({ field: { value, onChange } }) => (
          <View className="gap-2">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">Cuenta origen</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-0">
              {accounts.map((account) => (
                <AccountCard
                  key={`from-${account.id}`}
                  account={account}
                  isSelected={value === account.id}
                  onPress={() => onChange(account.id)}
                />
              ))}
            </ScrollView>
            {errors.fromAccountId?.message ? (
              <Text className="text-xs text-danger">{errors.fromAccountId.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="toAccountId"
        render={({ field: { value, onChange } }) => (
          <View className="gap-2">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">Cuenta destino</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-0">
              {accounts.map((account) => (
                <AccountCard
                  key={`to-${account.id}`}
                  account={account}
                  isSelected={value === account.id}
                  onPress={() => onChange(account.id)}
                />
              ))}
            </ScrollView>
            {errors.toAccountId?.message ? (
              <Text className="text-xs text-danger">{errors.toAccountId.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange } }) => (
          <View className="gap-2">
            <AmountInput
              label="Monto"
              value={value}
              currency={selectedFrom?.currency ?? 'DOP'}
              onChangeValue={onChange}
            />
            {errors.amount?.message ? (
              <Text className="text-xs text-danger">{errors.amount.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Descripcion"
            value={value}
            onChangeText={onChange}
            placeholder="Motivo de la transferencia"
            error={errors.description?.message}
          />
        )}
      />

      <Button
        label="Confirmar"
        onPress={handlePrepareSubmit}
        loading={isSubmitting || isConfirming}
      />

      {status === 'success' ? <TransferSuccessCard /> : null}
      {status === 'error' ? <TransferErrorCard message={statusMessage} /> : null}

      <Modal transparent visible={isConfirmOpen} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-2xl bg-white dark:bg-dark-surface p-4 gap-4">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">
              Confirmar transferencia
            </Text>
            <View className="gap-1">
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                Origen: {selectedFrom?.id ?? '--'}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                Destino: {selectedTo?.id ?? '--'}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                Monto: {pendingData?.amount ?? 0}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300">
                Descripcion: {pendingData?.description ?? ''}
              </Text>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button label="Cancelar" onPress={() => setIsConfirmOpen(false)} variant="ghost" />
              </View>
              <View className="flex-1">
                <Button label="Confirmar" onPress={handleConfirm} loading={isConfirming} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
