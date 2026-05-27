import { StyleSheet, Text, View } from 'react-native';
import { Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      {icon ? (
        <Text style={styles.emoji}>{icon}</Text>
      ) : (
        <Inbox size={36} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      )}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emoji: {
    fontSize: 32,
  },
  message: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
  },
});
