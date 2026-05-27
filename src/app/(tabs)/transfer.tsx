import { StyleSheet, Text, View } from 'react-native';

export default function TransferScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Transferencias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
});
