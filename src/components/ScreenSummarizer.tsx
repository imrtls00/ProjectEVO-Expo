// src/components/ScreenSummarizer.js
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { convertUiToHtml } from "../utils/uiToHtml";
import { queryLLM } from "../services/llmService";

export default function ScreenSummarizer({ uiHierarchy }) {
  const [summary, setSummary] = useState("");

  const generateSummary = async () => {
    const htmlRepresentation = convertUiToHtml(uiHierarchy);
    const prompt = `Summarize the following UI represented in HTML:\n${htmlRepresentation}`;
    const result = await queryLLM(prompt);
    setSummary(result);
  };

  return (
    <View>
      <Button title="Generate Summary" onPress={generateSummary} />
      <Text>{summary}</Text>
    </View>
  );
}
