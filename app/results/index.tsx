// src/screens/ResultsScreen.tsx

import React from "react";
import {
  View,
  Linking,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "@/src/constants/theme";

export default function ResultsScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams<{ result: string }>();
  
  const resultObj = JSON.parse(result);
  const action = resultObj[0].action;
  let displayMessage = resultObj[0].messageToShow;
  const body = resultObj[0].body;
  const subject = resultObj[0].subject;
  const email = "sp21-bse-071@cuilahore.edu.pk";
  const phone = "03076718155";

  function actionPerformer(action: string) {
    const openGmailApp = async (email: string, subject: string, body: string) => {
      const gmailUrl = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(gmailUrl);
    };
    
    const makePhoneCall = async (phoneNumber: string) => {
      const phoneUrl = `tel:${phoneNumber}`;
      await Linking.openURL(phoneUrl);
    };
    
    const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;
    
      await Linking.openURL(whatsappUrl);
      // Check if WhatsApp is installed
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        // Open WhatsApp with the message
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on this device");
      }
    };
    
    const setAlarm = async (hour: number, minute: number, message: string) => {
      if (Platform.OS === "android") {
        const alarmIntent = `intent://alarm`;
        await Linking.openURL(alarmIntent);
        const canOpen = await Linking.canOpenURL(alarmIntent);
        if (canOpen) {
          await Linking.openURL(alarmIntent);
        } else {
          Alert.alert("Error", "Unable to set alarm");
        }
      } else {
        Alert.alert("Error", "Setting alarms is only supported on Android");
      }
    };
    
    const gotoCalendar = async (subject: string, body: string) => {
      router.push("/calendar");
    };
    
    const openWeatherPage = (city: string) => {
      const weatherUrl = `https://www.google.com/search?q=weather+in+${encodeURIComponent(
        city
      )}`;
      Linking.openURL(weatherUrl).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    };


    if (action.includes("NotAvailable")) {
      displayMessage = "Sorry, this feature is under-development and is currently unavailable in beta-mode.";
    } else if (action.includes("SendEmail")) {
      console.log("Send Email feature implementation");
      openGmailApp("sp21-bse-071@cuilahore.edu.pk", subject, body);
    } else if (action.includes("SummaryOfEmails")) {
      console.log("Summary of Emails feature implementation");
      Linking.openURL("https://gmail.app.goo.gl");
    } else if (action.includes("ScheduleMeeting")) {
      console.log("Schedule Meeting feature implementation");
      gotoCalendar(subject, body);
    } else if (action.includes("SetAlarm")) {
      console.log("Set Alarm feature implementation");
      setAlarm(10, 30, subject);
    } else if (action.includes("TextWhatsApp")) {
      console.log("Text WhatsApp feature implementation");
      var WhatsAppMessage = subject + ":\n\n" + body;
      sendWhatsAppMessage("923076718155", WhatsAppMessage);
    } else if (action.includes("Call")) {
      console.log("Call feature implementation");
      makePhoneCall("03076718155");
    } else if (action.includes("Instagram")) {
      console.log("Instagram Feature Implementation");
      Linking.openURL("https://instagram.com");
    } else if (action.includes("Weather")) {
      console.log("Weather Feature Implementation");
      openWeatherPage("");
    } else {
      console.log(
        "Error occured at Root Level, Error: Model returned an unknown action"
      );
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Result</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{displayMessage}</Text>
      </ScrollView>
      <Text style={styles.title}>Test Actions</Text>
      <Pressable
        style={styles.button}
        onPress={() => actionPerformer(action)}
      >
        <Text style={styles.buttonText}>Perform Action</Text>
      </Pressable>
      <Pressable style={styles.buttonSecondary} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    padding: 20,
  },
  title: {
    color: theme.colors.textHighlightColor,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultText: {
    color: theme.colors.textColor,
    fontSize: 18,
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.colors.backgroundHighlightColor,
    padding: 16,
    borderRadius: 100,
    marginVertical: 8,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.backgroundColor,
    padding: 16,
    borderRadius: 100,
    marginVertical: 8,
    borderWidth: 4,
    borderColor: theme.colors.backgroundHighlightColor,
  },
  buttonText: {
    color: theme.colors.textHighlightColor,
    fontSize: 18,
    textAlign: "center",
  },
});
