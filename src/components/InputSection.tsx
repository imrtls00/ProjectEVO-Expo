import React from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles, colors, spacing, borderRadius } from '@/src/Styles/globalStyles';

const InputSection = ({ inputValue, onChange, onMicPress, onSend, recognizing }: any) => (
  <View style={globalStyles.container}>
    <TextInput
      style={globalStyles.input}
      placeholder="What do you wanna do?"
      placeholderTextColor={colors.TextSecondary}
      value={inputValue}
      onChangeText={onChange}
    />
    <Pressable style={globalStyles.button}>
      {inputValue ? (
        <MaterialIcons name="send" size={24} color={colors.TextHighlight} onPress={onSend} />
      ) : recognizing ? (
        <ActivityIndicator color={colors.TextHighlight} size="small" />
      ) : (
        <MaterialIcons name="mic" size={24} color={colors.TextHighlight} onPress={onMicPress} />
      )}
    </Pressable>
  </View>
);

export default InputSection;
