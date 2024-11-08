import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PromptCard from "../components/PromptCard";
import InputSection from "../components/InputSection";
import HeaderTitle from "../components/HeaderTitle";
import { model } from "../services/generativeAI";
import { useSpeechRecognition } from "../components/SpeechRecognition";

const HomeScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const navigation = useNavigation();
  const handleMicPress = useSpeechRecognition(
    setInputValue,
    recognizing,
    setRecognizing
  );

  const handlePrompt = async () => {
    if (!inputValue) return;
    const result = await model.generateContent(inputValue);
    navigation.navigate("Results", { result: result.response.text() });
  };

  return (
    <View style={styles.container}>
      <HeaderTitle />
      <FlatList
        horizontal
        data={[
          { id: "1", text: "Read a Summary of My Emails" },
          { id: "2", text: "Schedule a Meeting With Boss" },
          { id: "3", text: "Wake Me Up in 4 hours" },
          { id: "4", text: "Text Asad on WhatsApp" },
          { id: "5", text: "Call My Friend" },
        ]}
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#010616", padding: 20 },
  cardContainer: { marginBottom: 20 },
});

export default HomeScreen;
