import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      {/* Add your settings options here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    padding: 20,
  },
}); 