// src/screens/ResultsScreen.tsx

import React from 'react';
import { View, Linking, Alert, Text, StyleSheet, ScrollView, Button, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const openGmailApp = async () => {
  const gmailUrl = 'mailto:someone@example.com?subject=Hello&body=This is a test email';


  // Check if Gmail is available
  const canOpen = await Linking.canOpenURL(gmailUrl);
  if (canOpen) {
    // Open Gmail app
    await Linking.openURL(gmailUrl);
  } else {
    Alert.alert('Error', 'Gmail app is not available on this device');
  }
};

const makePhoneCall = async (phoneNumber: string) => {
  const phoneUrl = `tel:${phoneNumber}`;
  await Linking.openURL(phoneUrl);
};

const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
  await Linking.openURL(whatsappUrl);
  // Check if WhatsApp is installed
  const canOpen = await Linking.canOpenURL(whatsappUrl);
  if (canOpen) {
    // Open WhatsApp with the message
    await Linking.openURL(whatsappUrl);
  } else {
    Alert.alert('Error', 'WhatsApp is not installed on this device');
  }
};

const setAlarm = async (hour: number, minute: number, message: string) => {
  if (Platform.OS === 'android') {
    const alarmIntent = `intent://alarm`;
    await Linking.openURL(alarmIntent);
    const canOpen = await Linking.canOpenURL(alarmIntent);
    if (canOpen) {
      await Linking.openURL(alarmIntent);
    } else {
      Alert.alert('Error', 'Unable to set alarm');
    }
  } else {
    Alert.alert('Error', 'Setting alarms is only supported on Android');
  }
};

const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;

  var resultString = JSON.parse(result);

  console.log("Action Suggested by Model: ", resultString);
  console.log("Result From Model: ", result);

  // if (result.includes("NotAvailable")) {
  //   resultString = "Sorry, this feature is under-development and is currently unavailable in beta-mode.";
  // } else if (result.includes("SendEmail")) {
  //   console.log("Send Email feature implementation");
  //   openGmailApp();

  // } else if (result.includes("SummaryOfEmails")) {
  //   console.log("Summary of Emails feature implementation");
  // } else if (result.includes("ScheduleMeeting")) {
  //   console.log("Schedule Meeting feature implementation");
  // } else if (result.includes("SetAlarm")) {
  //   console.log("Set Alarm feature implementation");
  //   setAlarm(10, 30, "Wake up for work");

  // } else if (result.includes("TextWhatsApp")) {
  //   console.log("Text WhatsApp feature implementation");
  //   sendWhatsAppMessage("+1234567890", "Hello, this is a test message");
    
  // } else if (result.includes("Call")) {
  //   console.log("Call feature implementation");
  //   makePhoneCall("+1234567890");
  // } else {
  //   console.log("Error occured at Root Level, Error: Model returned an unknown action");
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Result</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{resultString}</Text>
      </ScrollView>
      <Button title="My Action" onPress={() => sendWhatsAppMessage("923076718155", "This is my message")} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    padding: 20,
  },
  title: {
    color: '#C6C9CF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultText: {
    color: '#B2B4B9',
    fontSize: 18,
    lineHeight: 24,
  },
});

export default ResultsScreen;
