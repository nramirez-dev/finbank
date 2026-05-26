import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferSchema, type TransferSchema } from '@/domain/schemas/transferSchema';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface TransferFormProps {
  onSubmit: (data: TransferSchema) => void;
  isSubmitting?: boolean;
  accounts: Array<{ id: string; label: string }>;
}

export const TransferForm = ({ onSubmit, isSubmitting = false, accounts: _ }: TransferFormProps) => {
  const {
    control,
    handleSubmit,
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

  return (
    <View className="gap-4 px-4">
      <Text className="text-lg font-bold text-slate-900 dark:text-white">Nueva transferencia</Text>

      <Controller
        control={control}
        name="fromAccountId"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Cuenta origen"
            value={value}
            onChangeText={onChange}
            placeholder="ID de cuenta origen"
            error={errors.fromAccountId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="toAccountId"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Cuenta destino"
            value={value}
            onChangeText={onChange}
            placeholder="ID de cuenta destino"
            error={errors.toAccountId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Monto"
            value={String(value || '')}
            onChangeText={(text) => onChange(parseFloat(text) || 0)}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Descripción"
            value={value}
            onChangeText={onChange}
            placeholder="Motivo de la transferencia"
            error={errors.description?.message}
          />
        )}
      />

      <Button
        label="Transferir"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        fullWidth
      />
    </View>
  );
};
