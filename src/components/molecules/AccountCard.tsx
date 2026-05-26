import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { Account } from '@/domain/entities/Account';
import { formatCurrency } from '@/lib/formatCurrency';

interface AccountCardProps {
  account: Account;
  isSelected?: boolean;
  onPress: () => void;
}

export const AccountCard = ({ account, isSelected = false, onPress }: AccountCardProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isSelected ? 1.02 : 1, { duration: 200 });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={animatedStyle}
        className={`rounded-2xl p-5 mr-4 w-60 ${
          isSelected
            ? 'bg-primary'
            : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700'
        }`}
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
        <View className="flex-row items-center justify-between mt-3">
          <Text
            className={`text-xs font-mono ${isSelected ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}
          >
            ···· {account.id.slice(-4)}
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className={`px-2 py-1 rounded-full ${
                isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <Text className={`text-xs ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                Enviar
              </Text>
            </View>
            <View
              className={`px-2 py-1 rounded-full ${
                isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <Text className={`text-xs ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                Detalles
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};
