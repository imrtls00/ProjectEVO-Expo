import React from "react";
import { Text, StyleSheet } from "react-native";

const HeaderTitle = () => (
  <Text style={styles.title}>
    Hi! 👋🏼 {"\n"}What can EVO {"\n"} do for you?
  </Text>
);

const styles = StyleSheet.create({
  title: {
    color: "#C6C9CF",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 60,
    marginTop: 60,
    marginBottom: 20,
  },
});

export default HeaderTitle;
