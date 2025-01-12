import React, { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Button, Alert, Text, View, ScrollView, AppState } from 'react-native';

const { MyAccessibilityModule } = NativeModules;
console.log(MyAccessibilityModule); // check if its null

const eventEmitter = new NativeEventEmitter(MyAccessibilityModule);

export default function Accessibility() {
  const [screenText, setScreenText] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // Reattach event listeners if needed
      }
      setAppState(nextAppState);
    };

    // Subscribe to AppState changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // Subscribe to native event
    const subscription = eventEmitter.addListener('ScreenContentExtracted', (text) => {
      setScreenText(text);
      Alert.alert('Extracted Screen Text', text);
    });

    return () => {
      subscription.remove();
      appStateListener.remove(); // ✅ Correct way to remove listener
    };
  }, [appState]);

  return (
    <View style={{ flex: 1, padding: 60, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Accessibility Settings" onPress={() => MyAccessibilityModule.openAccessibilitySettings()} />
      <ScrollView style={{ marginTop: 20, width: '100%', height: '50%' }}>
        <Text>{screenText}</Text>
      </ScrollView>
    </View>
  );
}
