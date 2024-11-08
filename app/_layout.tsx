import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { Urbanist_400Regular, Urbanist_500Medium } from '@expo-google-fonts/urbanist';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Urbanist-Regular': Urbanist_400Regular,
        'Urbanist-Medium': Urbanist_500Medium,
      });
    }
    loadFonts();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="splash/index" />
      <Stack.Screen name="results/index" />
      <Stack.Screen name="calendar/index" />
    </Stack>
  );
}
