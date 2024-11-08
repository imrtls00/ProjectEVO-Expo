import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const PromptCard = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Text style={styles.cardText}>{text}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
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
});

export default PromptCard;