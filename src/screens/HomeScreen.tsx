// src/screens/HomeScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import GemAPI from "../../secret";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: ScreenNavigationProp;
};

type Prompt = {
  id: string;
  text: string;
};

const prompts: Prompt[] = [
  { id: "1", text: "Read a Summary of My Emails" },
  { id: "2", text: "Schedule a Meeting With Boss" },
  { id: "3", text: "Wake Me Up in 4 hours" },
];

const HomeScreen: React.FC<Props> = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const navigation = useNavigation<ScreenNavigationProp>();

  const genAI = new GoogleGenerativeAI(GemAPI);

  const schema = {
    description: "List of actions to be performed",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        actionName: {
          type: SchemaType.STRING,
          description: "any of the following",
          enum: [
            "SummaryOfEmails",
            "SendEmail",
            "ScheduleMeeting",
            "SetAlarm",
            "TextWhatsApp",
            "Call",
            "NotAvailable",
          ],
          nullable: false,
        },
        message: {
          type: SchemaType.STRING,
          description: "Text Response",
        },
      },
      required: ["actionName"],
    },
  };

  // Function to handle voice-to-text conversion - alt approach
  function Speech2Text() {
    const [recognizing, setRecognizing] = useState(false);
    const [transcript, setTranscript] = useState("");

    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => setRecognizing(false));
    useSpeechRecognitionEvent("result", (event) => {
      setTranscript(event.results[0]?.transcript);
    });
    useSpeechRecognitionEvent("error", (event) => {
      console.log("error code:", event.error, "error messsage:", event.message);
    });

    const handleStart = async () => {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        console.warn("Permissions not granted", result);
        return;
      }
      // Start speech recognition
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
        contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
      });
    };

    return (
      <View>
        {!recognizing ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button title="Stop" onPress={ExpoSpeechRecognitionModule.stop} />
        )}

        <ScrollView>
          <Text>{transcript}</Text>
        </ScrollView>
      </View>
    );
  }

  // Function to handle input submission and send to Gemini API
  const handlePrompt = async () => {
    if (!inputValue) {
      alert("Please enter a prompt or use voice input");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const result = await model.generateContent(inputValue);
      navigation.navigate("Results", { result: result.response.text() });
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  // Render each prompt item
  const renderPromptItem = ({ item }: { item: Prompt }) => (
    <Pressable style={styles.card} onPress={() => setInputValue(item.text)}>
      <Text style={styles.cardText}>{item.text}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi! 👋🏼 {"\n"}What can EVO {"\n"} do for you?
      </Text>

      <Text style={styles.subHeading}>
        Quick Prompts{" "}
        <Text style={styles.divider}>--------------------------------</Text>
      </Text>

      <FlatList
        horizontal
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={renderPromptItem}
        contentContainerStyle={styles.cardContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What do you wanna do?"
          placeholderTextColor="#616A73"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Pressable style={styles.submitButton} onPress={handlePrompt}>
          <MaterialIcons
            name={inputValue ? "send" : "mic"} // Show microphone when input is empty
            size={24}
            color="#FFF"
            onPress={inputValue ? handlePrompt : Speech2Text} // Trigger voice2Text if input is empty
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010616",
    padding: 20,
  },
  title: {
    color: "#C6C9CF",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 60,
    marginTop: 60,
    marginBottom: 20,
  },
  subHeading: {
    color: "#B2B4B9",
    fontSize: 24,
    fontWeight: "medium",
    marginTop: 40,
    marginBottom: 20,
  },
  divider: {
    color: "#0061FF",
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#010F2D",
    padding: 32,
    borderRadius: 32,
    marginRight: 12,
    height: 138,
    width: 200,
  },
  cardText: {
    color: "#999FAB",
    fontSize: 20,
    fontWeight: "medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#0061FF",
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 4,
    paddingVertical: 4,
    backgroundColor: "#010616",
  },
  input: {
    flex: 1,
    color: "#F0F0F0",
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: "#0061FF",
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
});

export default HomeScreen;
