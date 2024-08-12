// src/components/QuestionAnswerer.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { convertUiToHtml } from '../utils/uiToHtml';
import { queryLLM } from '../services/llmService';

export default function QuestionAnswerer({ uiHierarchy }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const answerQuestion = async () => {
    const htmlRepresentation = convertUiToHtml(uiHierarchy);
    const prompt = `Given this UI:\n${htmlRepresentation}\nAnswer the following question: ${question}`;
    const result = await queryLLM(prompt);
    setAnswer(result);
  };

  return (
    <View>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Enter your question"
      />
      <Button title="Get Answer" onPress={answerQuestion} />
      <Text>{answer}</Text>
    </View>
  );
}