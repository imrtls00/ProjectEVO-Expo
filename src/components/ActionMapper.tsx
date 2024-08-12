// src/components/ActionMapper.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { convertUiToHtml } from '../utils/uiToHtml';
import { queryLLM } from '../services/llmService';

export default function ActionMapper({ uiHierarchy }) {
  const [instruction, setInstruction] = useState('');
  const [action, setAction] = useState('');

  const mapAction = async () => {
    const htmlRepresentation = convertUiToHtml(uiHierarchy);
    const prompt = `Given this UI:\n${htmlRepresentation}\nMap the following instruction to a UI action: ${instruction}`;
    const result = await queryLLM(prompt);
    setAction(result);
  };

  return (
    <View>
      <TextInput
        value={instruction}
        onChangeText={setInstruction}
        placeholder="Enter an instruction"
      />
      <Button title="Map Action" onPress={mapAction} />
      <Text>{action}</Text>
    </View>
  );
}