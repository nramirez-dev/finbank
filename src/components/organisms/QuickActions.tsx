import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CreditCard, QrCode, Send, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  onPress?: () => void;
}

const QuickAction = ({ icon, label, accentColor, onPress }: QuickActionProps) => (
  <Pressable style={styles.actionContainer} onPress={onPress}>
    <View style={[styles.actionButton, { borderColor: `${accentColor}30` }]}>
      <View style={[styles.actionBg, { backgroundColor: `${accentColor}18` }]} />
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

export const QuickActions = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <QuickAction
        icon={<Send size={24} color="#3b82f6" strokeWidth={2} />}
        label="Transferir"
        accentColor="#3b82f6"
        onPress={() => router.push('/transfer')}
      />
      <QuickAction
        icon={<CreditCard size={24} color="#10b981" strokeWidth={2} />}
        label="Pagar"
        accentColor="#10b981"
      />
      <QuickAction
        icon={<Smartphone size={24} color="#f59e0b" strokeWidth={2} />}
        label="Recargar"
        accentColor="#f59e0b"
      />
      <QuickAction
        icon={<QrCode size={24} color="#ec4899" strokeWidth={2} />}
        label="QR"
        accentColor="#ec4899"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionContainer: {
    alignItems: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  actionBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
});
