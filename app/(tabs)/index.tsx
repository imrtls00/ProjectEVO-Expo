import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

// Import constants and services
import { promptData } from "@/src/constants/data";
import { model } from "@/src/services/generativeAI";
import { theme } from "@/src/constants/theme";
import { globalStyles, colors } from "@/src/Styles/globalStyles";
import { useResults } from "@/src/context/ResultsContext";

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setResults } = useResults();
  const [googleUser, setGoogleUser] = useState(null);
  const [submitPromptAutomatically, setSubmitPromptAutomatically] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false); // NEW: Track input source

  useFocusEffect(
    useCallback(() => {
      setInputValue("");
      setLoading(false);
    }, [])
  );

  // Load stored preferences
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("googleUser");
        if (storedUser) setGoogleUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error retrieving Google user data:", error);
      }

      try {
        const storedValue = await AsyncStorage.getItem("submitPromptAutomatically");
        if (storedValue !== null) {
          setSubmitPromptAutomatically(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error("Error retrieving submit setting:", error);
      }
    })();
  }, []);

  // Handle Speech Recognition Events
  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));

  // Capture Speech Result & Mark as Voice Input
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript || "";
    setInputValue(transcript);
    setIsVoiceInput(true); // NEW: Mark input as coming from voice
  });

  // Submit only when input is from voice and setting is enabled
  useEffect(() => {
    if (isVoiceInput && submitPromptAutomatically && inputValue.trim()) {
      handlePrompt();
      setIsVoiceInput(false); // Reset flag after submission
    }
  }, [inputValue, isVoiceInput, submitPromptAutomatically]);

  const handleMicPress = async () => {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (result.granted) {
        ExpoSpeechRecognitionModule.start({ lang: "en-US" });
      }
    }
  };

  const handlePrompt = async () => {
    if (!inputValue.trim()) return;

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert("Error", "Internet connection is required.");
      return;
    }

    setLoading(true);
    try {
      const result = await model.generateContent(inputValue);
      const response = await result.response.text();
      setResults(response);
      router.navigate("/(tabs)/results");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.title}>
        Hi {googleUser?.name}! 👋🏼 {"\n"}What can EVO {"\n"}do for you?
      </Text>

      {/* Prompt Cards */}
      <FlatList
        horizontal
        data={promptData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={globalStyles.card}
            onPress={() => {
              setInputValue(item.text);
              setIsVoiceInput(false); // Ensure manual selection doesn't auto-submit
            }}
          >
            <Text style={globalStyles.text}>{item.text}</Text>
          </Pressable>
        )}
        contentContainerStyle={globalStyles.cardListContainer}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={globalStyles.input}
          placeholder="What do you wanna do?"
          placeholderTextColor={colors.TextSecondary}
          value={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
            setIsVoiceInput(false); // Prevent auto-submit for manual input
          }}
          editable={!loading}
        />

        {loading ? (
          <View style={globalStyles.loaderContainer}>
            <ActivityIndicator color={colors.Theme} size="small" />
            <Text style={globalStyles.loaderText}>Processing...</Text>
          </View>
        ) : (
          <Pressable style={styles.submitButton}>
            {inputValue ? (
              <MaterialIcons
                name="send"
                size={24}
                color={colors.TextHighlight}
                onPress={handlePrompt}
              />
            ) : recognizing ? (
              <ActivityIndicator color={colors.TextHighlight} size="small" />
            ) : (
              <MaterialIcons
                name="mic"
                size={24}
                color={colors.TextHighlight}
                onPress={handleMicPress}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 4,
    paddingVertical: 4,
    backgroundColor: colors.BackgroundSecondary,
  },
  submitButton: {
    backgroundColor: "#0061FF",
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
});

