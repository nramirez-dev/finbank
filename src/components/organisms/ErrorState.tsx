import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from '@/components/atoms/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Ocurrió un error', onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <AlertCircle size={36} color="#ef4444" strokeWidth={1.5} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button label="Reintentar" onPress={onRetry} variant="ghost" size="sm" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  message: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
});
