import React, { useMemo } from "react";
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { globalStyles, colors } from "@/src/Styles/globalStyles";

const InputSection = ({ inputValue, onChange, onMicPress, onSend, recognizing, loading }) => {
  const buttonIcon = useMemo(() => {
    if (loading) return <ActivityIndicator color={colors.TextHighlight} size="small" />;
    if (inputValue) return <MaterialIcons name="send" size={24} color={colors.TextHighlight} onPress={onSend} />;
    if (recognizing) return <ActivityIndicator color={colors.TextHighlight} size="small" />;
    return <MaterialIcons name="mic" size={24} color={colors.TextHighlight} onPress={onMicPress} />;
  }, [inputValue, recognizing, loading]);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={globalStyles.input}
        placeholder="What do you wanna do?"
        placeholderTextColor={colors.TextSecondary}
        value={inputValue}
        onChangeText={onChange}
        editable={!loading}
      />
      <Pressable style={styles.submitButton}>{buttonIcon}</Pressable>
    </View>
  );
};

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
  submitButton: {
    backgroundColor: "#0061FF",
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
});

export default React.memo(InputSection); // ✅ Prevents unnecessary re-renders
