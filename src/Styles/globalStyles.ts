// globalStyles.ts
import { StyleSheet } from 'react-native';

export const colors = {
  Theme: '#0061FF',
  Background: '#010616',
  BackgroundSecondary: '#010F2D',
  Heading: '#F7FAFD',
  Text: '#ADB1B8',
  TextSecondary: '#616A73',
  TextHighlight: '#F0F0F0',
  Border: '#0061FF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 60,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 30,
  xl: 32,
  circle: 100,
};

export const fontSize = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 28,
  xxxl: 32,
  huge: 36,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    padding: spacing.lg,
  },
  heading: {
    color: colors.Heading,
    fontSize: fontSize.huge,
    fontFamily: 'Urbanist-Medium',
    fontWeight: 'bold',
    lineHeight: spacing.xxxl,
  },
  text: {
    color: colors.Text,
    fontSize: fontSize.md,
    fontFamily: 'Urbanist-Regular',
  },
  button: {
    backgroundColor: colors.Theme,
    padding: spacing.md,
    borderRadius: borderRadius.circle,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.Background,
    padding: spacing.md,
    borderRadius: borderRadius.circle,
    marginVertical: spacing.xs,
    borderWidth: 4,
    borderColor: colors.Theme,
  },
  buttonText: {
    color: colors.TextHighlight,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    color: colors.TextHighlight,
    fontSize: fontSize.md,
  },
  card: {
    backgroundColor: colors.BackgroundSecondary,
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    height: 138,
    width: 200,
  },
  title: {
    color: colors.TextHighlight,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  linkText: {
    fontSize: fontSize.xs,
    color: colors.Theme,
  },
  resultContainer: {
    flex: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  resultText: {
    color: colors.TextHighlight,
    fontSize: fontSize.md,
  },
});
