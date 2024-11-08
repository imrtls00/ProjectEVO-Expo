import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Import from src folder using alias
import { PromptCard, InputSection, HeaderTitle } from "@/src/components";
import { useSpeechRecognition } from "@/src/hooks/useSpeechRecognition";
import { model } from "@/src/services/generativeAI";
import { theme } from "@/src/constants/theme";
import { promptData } from "@/src/constants/data";

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const router = useRouter();
  
  const handleMicPress = useSpeechRecognition(
    setInputValue,
    recognizing,
    setRecognizing
  );

  const handlePrompt = async () => {
    if (!inputValue) return;
    const result = await model.generateContent(inputValue);
    router.push({
      pathname: "/results",
      params: { result: result.response.text() }
    });
  };

  return (
    <View style={styles.container}>
      <HeaderTitle />
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
        contentContainerStyle={styles.cardContainer}
      />
      <InputSection
        inputValue={inputValue}
        onChange={setInputValue}
        onMicPress={handleMicPress}
        onSend={handlePrompt}
        recognizing={recognizing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundColor, 
    padding: 20 
  },
  cardContainer: { 
    marginBottom: 20 
  },
});
