import React, { useState } from "react";
import { Text, View, FlatList } from "react-native";
import { router } from "expo-router";
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useResults } from '@/src/context/ResultsContext';

// Import from src folder using alias
import { PromptCard, InputSection } from "@/src/components";
import { useSpeechRecognition } from "@/src/hooks/useSpeechRecognition";
import { model } from "@/src/services/generativeAI";
import { theme } from "@/src/constants/theme";
import { promptData } from "@/src/constants/data";
import { globalStyles } from "@/src/Styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setResults } = useResults();
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  interface GoogleUser {
    name: string;
    email: string;
    // Add other properties if needed
  }

  // Clear input when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setInputValue("");
      setLoading(false);
    }, [])
  );

  const handleMicPress = useSpeechRecognition(
    setInputValue,
    recognizing,
    setRecognizing
  );

  const handlePrompt = async () => {
    if (!inputValue) return;
    setLoading(true);
    try {
      const result = await model.generateContent(inputValue);
      const response = await result.response.text();
      setResults(response);
      router.navigate("/(tabs)/results");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoogleUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("googleUser");
      if (storedUser) {
        setGoogleUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error retrieving Google user data:", error);
    }
  };

  getGoogleUser();

  return (
    <View style={globalStyles.inputContainer}>
      <Text style={globalStyles.title}>
        Hi { googleUser?.name }! 👋🏼 {"\n"}What can EVO {"\n"}do for you?
      </Text>
      <FlatList
        horizontal
        data={promptData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PromptCard
            text={item.text}
            onPress={() => setInputValue(item.text)}
          />
        )}
        contentContainerStyle={globalStyles.cardListContainer}
      />
      <InputSection
        inputValue={inputValue}
        onChange={setInputValue}
        onMicPress={handleMicPress}
        onSend={handlePrompt}
        recognizing={recognizing}
        loading={loading}
      />
    </View>
  );
}
