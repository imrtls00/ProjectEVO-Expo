// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import openApp from '../services/openApp';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { useNavigation } from '@react-navigation/native';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: ScreenNavigationProp;
};

type Prompt = {
  id: string;
  text: string;
};

const prompts: Prompt[] = [
  { id: '1', text: 'Read a Summary of My Emails' },
  { id: '2', text: 'Schedule a Meeting With Boss' },
  { id: '3', text: 'Wake Me Up in 4 hours' },
];

const HomeScreen: React.FC<Props> = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const navigation = useNavigation();

  const apiKey: string = process.env.API_KEY || 'AIzaSyCyZOLwsKnsZrfujm2HkQr7SQUSfoxeuqQ';
  const genAI = new GoogleGenerativeAI(apiKey);

  // Function to handle input submission and send to Gemini API
  const handlePrompt = async () => {
    if (!inputValue) {

      // Alert user if input is empty
      return alert('Please enter a prompt before submitting');

      // Speech to Text feature here.
    }

    try {
      // Load the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Send the prompt (inputValue) to the Gemini API
      const result = await model.generateContent(inputValue);

      // Navigate to Results screen with the generated result
      navigation.navigate('Results', { result: result.response.text() });
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const renderPromptItem = ({ item }: { item: Prompt }) => (
    <Pressable style={styles.card} onPress={() => setInputValue(item.text)}>
      <Text style={styles.cardText}>{item.text}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi! 👋🏼 {'\n'}
        What can EVO {'\n'}
        do for you?
      </Text>

      <Text style={styles.subHeading}>
        Quick Prompts <Text style={styles.divider}>--------------------------------</Text>
      </Text>

      <FlatList
        horizontal
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={renderPromptItem}
        contentContainerStyle={styles.cardContainer}
      />

      <View style={styles.buttonsContainer}>
        <Button title="Open WhatsApp" onPress={() => openApp("WhatsApp")} />
        <Button title="Open Facebook" onPress={() => openApp("Facebook")} />
        <Button title="Open Instagram" onPress={() => openApp("Instagram")} />
        <Button title="Open Twitter" onPress={() => openApp("Twitter")} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What do you wanna do?"
          placeholderTextColor="#616A73"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Pressable style={styles.submitButton} onPress={handlePrompt}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    padding: 20,
  },
  title: {
    color: '#C6C9CF',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 60,
    marginTop: 60,
    marginBottom: 20,
  },
  subHeading: {
    color: '#B2B4B9',
    fontSize: 24,
    fontWeight: 'medium',
    marginTop: 40,
    marginBottom: 20,
  },
  divider: {
    color: '#0061FF',
    marginLeft: 10,
    marginRight: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#010F2D',
    padding: 32,
    borderRadius: 32,
    marginRight: 12,
    height: 138,
    width: 200,
  },
  cardText: {
    color: '#999FAB',
    fontSize: 20,
    fontWeight: 'medium',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0061FF',
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 4,
    paddingVertical: 4,
    backgroundColor: '#010616',
  },
  input: {
    flex: 1,
    color: '#F0F0F0',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#0061FF',
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default HomeScreen;
