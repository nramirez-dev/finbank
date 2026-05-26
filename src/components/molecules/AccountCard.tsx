import { View, Text, TouchableOpacity } from 'react-native';
import type { Account } from '@/domain/entities/Account';
import { formatCurrency } from '@/lib/formatCurrency';
import { useAppStore } from '@/store/useAppStore';

interface AccountCardProps {
  account: Account;
}

export const AccountCard = ({ account }: AccountCardProps) => {
  const selectedAccountId = useAppStore((s) => s.selectedAccountId);
  const setSelectedAccount = useAppStore((s) => s.setSelectedAccount);
  const isSelected = selectedAccountId === account.id;

  return (
    <TouchableOpacity
      className={`rounded-2xl p-5 mr-4 w-56 ${
        isSelected
          ? 'bg-primary'
          : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700'
      }`}
      onPress={() => setSelectedAccount(isSelected ? null : account.id)}
      activeOpacity={0.8}
    >
      <Text
        className={`text-xs font-medium mb-1 capitalize ${isSelected ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}
      >
        {account.type} · {account.currency}
      </Text>
      <Text
        className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}
      >
        {formatCurrency(account.balance, account.currency)}
      </Text>
      <Text
        className={`text-xs mt-3 font-mono ${isSelected ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}
      >
        ···· {account.id.slice(-4)}
      </Text>
    </TouchableOpacity>
  );
};
