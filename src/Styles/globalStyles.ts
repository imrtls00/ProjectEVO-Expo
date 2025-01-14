// globalStyles.ts
import { StyleSheet } from "react-native";

export const colors = {
  Theme: "#0061FF",
  Background: "#010616",
  BackgroundSecondary: "#010F2D",
  Heading: "#F7FAFD",
  Text: "#ADB1B8",
  TextSecondary: "#616A73",
  TextHighlight: "#F0F0F0",
  Border: "#0061FF",
  Danger: "#FF0000",
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
    fontFamily: "Urbanist-Medium",
    fontWeight: "bold",
    lineHeight: spacing.xxxl,
  },
  text: {
    color: colors.Text,
    fontSize: fontSize.md,
    fontFamily: "Urbanist-Regular",
  },
  button: {
    backgroundColor: colors.Theme,
    padding: spacing.md,
    borderRadius: borderRadius.circle,
    marginVertical: spacing.xs,
    alignItems: "center",
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
    textAlign: "center",
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
    fontFamily: "Urbanist-Medium",
    color: colors.TextHighlight,
    fontSize: fontSize.huge,
    lineHeight: spacing.xxxl,
    marginBottom: spacing.lg,
    marginTop: spacing.xxxl,
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
    width: "100%",
    marginVertical: spacing.md,
  },
  resultText: {
    color: colors.TextHighlight,
    fontSize: fontSize.md,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginHorizontal: spacing.md,
  },
  loaderText: {
    color: colors.Theme,
    fontSize: fontSize.xs,
    fontFamily: "Urbanist-Regular",
    marginVertical: spacing.lg,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.Background,
    padding: spacing.lg,
  },
  cardListContainer: {
    marginBottom: spacing.lg,
    overflow: "visible",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.Border,

  },
  signInButton: {
    marginVertical: spacing.md,
  },
  buttonDanger: {
    backgroundColor: colors.Danger, // Use a red color or a different color for danger
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
    alignItems: "center",
  },
  calendarItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    // Add any other styles you need
  },
  eventItem: {
    // Define your styles here, for example:
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginVertical: 10,
  },
});
