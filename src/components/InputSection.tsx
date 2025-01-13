import React from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles, colors } from '@/src/Styles/globalStyles';

const InputSection = ({ inputValue, onChange, onMicPress, onSend, recognizing, loading }: any) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={globalStyles.input}
      placeholder="What do you wanna do?"
      placeholderTextColor={colors.TextSecondary}
      value={inputValue}
      onChangeText={onChange}
      editable={!loading}
    />
    {loading ? (
      <View style={globalStyles.loaderContainer}>
        <ActivityIndicator color={colors.Theme} size="small" />
        <Text style={globalStyles.loaderText}>Engine is evaluating...</Text>
      </View>
    ) : (
      <Pressable style={styles.submitButton}>
        {inputValue ? (
          <MaterialIcons name="send" size={24} color={colors.TextHighlight} onPress={onSend} />
        ) : recognizing ? (
          <ActivityIndicator color={colors.TextHighlight} size="small" />
        ) : (
          <MaterialIcons name="mic" size={24} color={colors.TextHighlight} onPress={onMicPress} />
        )}
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 4,
    paddingVertical: 4,
    backgroundColor: colors.BackgroundSecondary,
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
