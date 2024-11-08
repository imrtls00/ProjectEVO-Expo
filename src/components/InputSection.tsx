import React from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const InputSection = ({ inputValue, onChange, onMicPress, onSend, recognizing }: any) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="What do you wanna do?"
      placeholderTextColor="#616A73"
      value={inputValue}
      onChangeText={onChange}
    />
    <Pressable style={styles.submitButton}>
      {inputValue ? (
        <MaterialIcons name="send" size={24} color="#FFF" onPress={onSend} />
      ) : recognizing ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <MaterialIcons name="mic" size={24} color="#FFF" onPress={onMicPress} />
      )}
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
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

export default InputSection;
