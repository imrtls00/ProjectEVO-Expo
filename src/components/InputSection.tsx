import React from "react";
import { View, TextInput, Pressable, ActivityIndicator, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles, colors } from '@/src/Styles/globalStyles';

const InputSection = ({ inputValue, onChange, onMicPress, onSend, recognizing, loading }: any) => (
  <View style={globalStyles.container}>
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
      <Pressable style={globalStyles.button}>
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

export default InputSection;
