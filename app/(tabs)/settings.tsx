import { View } from 'react-native';
import { ThemedText } from '@/src/components/ThemedText';
import { globalStyles } from '@/src/Styles/globalStyles';

export default function SettingsScreen() {
  return (
    <View style={globalStyles.container}>
      <ThemedText type="title">Settings</ThemedText>
      {/* Add your settings options here */}
    </View>
  );
} 