import React from "react";
import { Pressable, Text } from "react-native";
import { globalStyles } from '@/src/Styles/globalStyles';

const PromptCard = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <Pressable style={globalStyles.card} onPress={onPress}>
    <Text style={globalStyles.title}>{text}</Text>
  </Pressable>
);

export default PromptCard;