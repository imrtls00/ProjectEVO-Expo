// src/screens/ResultsScreen.tsx

import React from "react";
import {
  View,
  Linking,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { router } from "expo-router";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Results">;
type ScreenRouteProp = RouteProp<RootStackParamList, "Results">;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const openGmailApp = async (email: string, subject: string, body: string) => {
  const gmailUrl = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  await Linking.openURL(gmailUrl);

  // Check if Gmail is available
  // await Linking.canOpenURL(gmailUrl);
  // if (canOpen) {
  //   // Open Gmail app
  //   await Linking.openURL(gmailUrl);
  // } else {
  //   Alert.alert('Error', 'Gmail app is not available on this device');
  // }
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
  // navigate to MyCalendar.tsx
  router.push("./MyCalendar");
};

const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;
  var resultObj = JSON.parse(result);
  const action = resultObj[0].action;
  const message = resultObj[0].message;
  const body = resultObj[0].body;
  const subject = resultObj[0].subject;
  const email = "sp21-bse-071@cuilahore.edu.pk";
  const phone = "03076718155";

  console.log("Action Suggested by Model: ", action);
  console.log("Message: ", message);
  console.log("Body: ", body);

  if (action.includes("NotAvailable")) {
    resultString =
      "Sorry, this feature is under-development and is currently unavailable in beta-mode.";
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
  } else {
    console.log(
      "Error occured at Root Level, Error: Model returned an unknown action"
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Result</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{message}</Text>
      </ScrollView>
      <Text style={styles.title}>Test Actions</Text>
      <View>
        <Button
          title="WA Test"
          onPress={() =>
            sendWhatsAppMessage("923076718155", subject + ":\n\n" + body)
          }
        />
        <Button
          title="Alarm"
          onPress={() =>
            setAlarm(10, 30, subject)
          }
        />
        <Button
          title="Call"
          onPress={() =>
            makePhoneCall(phone)
          }
        />
        <Button
          title="Email"
          onPress={() =>
            openGmailApp(email, subject, body)
          }
        />
        <Button
          title="Summary"
          onPress={() =>
            Linking.openURL("https://gmail.app.goo.gl")
          }
        />
        <Button
          title="Calendar"
          onPress={() =>
            gotoCalendar(subject, body)
          }
        />
        <Button
          title="Instagram"
          onPress={() =>
            Linking.openURL("https://instagram.com")
          }
        />
      </View>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010616",
    padding: 20,
  },
  title: {
    color: "#C6C9CF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultText: {
    color: "#B2B4B9",
    fontSize: 18,
    lineHeight: 24,
  },
});

export default ResultsScreen;
