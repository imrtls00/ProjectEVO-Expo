// src/components/QuestionGenerator.js
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { convertUiToHtml } from '../utils/uiToHtml';
import { queryLLM } from '../services/llmService';

export default function QuestionGenerator({ uiHierarchy }) {
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    const htmlRepresentation = convertUiToHtml(uiHierarchy);
    const prompt = `Generate relevant questions about user input fields in this UI:\n${htmlRepresentation}`;
    const result = await queryLLM(prompt);
    setQuestions(result.split('\n')); // Assuming the LLM returns questions separated by newlines
  };

  return (
    <View>
      <Button title="Generate Questions" onPress={generateQuestions} />
      {questions.map((question, index) => (
        <Text key={index}>{question}</Text>
      ))}
    </View>
  );
}