import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Account } from '@/domain/entities/Account';
import { formatCurrency } from '@/lib/formatCurrency';

interface AccountCardProps {
  account: Account;
  isSelected?: boolean;
  onPress: () => void;
}

const GRADIENTS: Record<Account['type'], string[]> = {
  corriente: ['#3b82f6', '#2563eb', '#1d4ed8'],
  ahorros:   ['#10b981', '#059669', '#047857'],
};

export const AccountCard = ({ account, isSelected = false, onPress }: AccountCardProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isSelected ? 1.03 : 1, { duration: 200 });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradient = GRADIENTS[account.type];

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[animatedStyle, isSelected && styles.selectedRing]}>
        <LinearGradient
          colors={gradient as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>F</Text>
              </View>
              <Text style={styles.cardType}>
                {account.type.toUpperCase()} · {account.currency}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <Text style={styles.cardNumber}>**** {account.id.slice(-4)}</Text>
              <Text style={styles.cardBalance}>
                {formatCurrency(account.balance, account.currency)}
              </Text>
            </View>

            {/* Footer decoration */}
            <View style={styles.cardFooter}>
              <View style={styles.chip}>
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
              </View>
              <View style={styles.contactless}>
                <Text style={styles.contactlessText}>{'}'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selectedRing: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  card: {
    width: 272,
    height: 162,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBody: {
    marginTop: 10,
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 6,
  },
  cardBalance: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    gap: 3,
  },
  chipLine: {
    width: 2,
    height: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.82)',
    borderRadius: 1,
  },
  contactless: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactlessText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    transform: [{ rotate: '90deg' }],
  },
});
