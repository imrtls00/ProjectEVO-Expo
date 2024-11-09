import { Redirect, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
} from "@expo-google-fonts/urbanist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResultsProvider } from "@/src/context/ResultsContext";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Urbanist-Regular": Urbanist_400Regular,
        "Urbanist-Medium": Urbanist_500Medium,
      });
    }

    async function checkFirstLaunch() {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");

      if (hasLaunched === null) {
        // First launch
        setIsFirstLaunch(true);

        // Set the hasLaunched key to true
        await AsyncStorage.setItem("hasLaunched", "true");
      } else {
        // Not the first launch
        setIsFirstLaunch(false);
      }
    }

    loadFonts();
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return (
      null
    );
  }

  return (
    <>
      <ResultsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ResultsProvider>
    </>
  );
}
