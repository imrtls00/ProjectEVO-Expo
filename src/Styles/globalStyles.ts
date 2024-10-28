// globalStyles.ts
import { StyleSheet } from 'react-native';

export const colors = {
  Theme: '#0061FF',
  Background: '#010616',
  Heading: '#F7FAFD',
  Text: '#ADB1B8',
};

export const size = {
  "#32": 32,
  "#24": 24,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    paddingHorizontal: size["#24"],
  },
  heading: {
    color: colors.Heading,
    fontSize: size["#32"],
    fontFamily: 'Urbanist-Medium',
  },
  text: {
    color: colors.Text,
    fontSize: size["#24"],
    fontFamily: 'Urbanist-Regular',
  },
  button: {
    backgroundColor: colors.Theme,
    margin: size["#24"],
    paddingVertical: size["#24"],
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
  },
});
