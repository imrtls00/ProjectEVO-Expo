import React, { useState } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { globalStyles } from '@/src/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [submitPromptAutomatically, setSubmitPromptAutomatically] = useState(false);
  const [performActionAutomatically, setPerformActionAutomatically] = useState(false);

  const handleToggleSubmitPrompt = () => {
    setSubmitPromptAutomatically((prev) => !prev);
    // Save the preference to AsyncStorage if needed
    AsyncStorage.setItem('submitPromptAutomatically', JSON.stringify(!submitPromptAutomatically));
  };

  const handleTogglePerformAction = () => {
    setPerformActionAutomatically((prev) => !prev);
    // Save the preference to AsyncStorage if needed
    AsyncStorage.setItem('performActionAutomatically', JSON.stringify(!performActionAutomatically));
  };

  const handleShowOnboarding = () => {
    router.push('/onboarding'); // Navigate to the onboarding screen
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete Data",
      "Are you sure you want to delete/reset all your data?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Clear AsyncStorage or reset your data here
            await AsyncStorage.clear();
            Alert.alert("Data Deleted", "All your data has been reset.");
          }
        }
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>

      <View style={globalStyles.settingItem}>
        <Text style={globalStyles.text}>Submit prompt automatically when using voice input</Text>
        <Switch
          value={submitPromptAutomatically}
          onValueChange={handleToggleSubmitPrompt}
        />
      </View>

      <View style={globalStyles.settingItem}>
        <Text style={globalStyles.text}>Perform the action automatically on results screen</Text>
        <Switch
          value={performActionAutomatically}
          onValueChange={handleTogglePerformAction}
        />
      </View>

      <Pressable style={globalStyles.button} onPress={handleShowOnboarding}>
        <Text style={globalStyles.buttonText}>Show Onboarding Screen</Text>
      </Pressable>

      <Pressable style={globalStyles.buttonDanger} onPress={handleDeleteData}>
        <Text style={globalStyles.buttonText}>Delete / Reset all my data</Text>
      </Pressable>
    </View>
  );
} 