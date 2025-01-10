import React from "react";
import {
  View,
  Linking,
  Alert,
  Text,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { globalStyles } from '@/src/Styles/globalStyles';
import { useResults } from '@/src/context/ResultsContext';
import { model } from "@/src/services/generativeAI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEmailSummmary } from "@/src/services/getEmailSummary";
import Markdown from 'react-native-markdown-display';

export default function ResultsScreen() {
  const router = useRouter();
  const { results, setResults } = useResults();
  
  if (!results) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>No Results</Text>
        <Text style={globalStyles.text}>Try asking something from the home screen.</Text>
      </View>
    );
  }

  const resultObj = JSON.parse(results);
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
      openGmailApp(email, subject, body);
    } else if (action.includes("SummaryOfEmails")) {
      // Linking.openURL("https://gmail.app.goo.gl");
      async function fetchSummary() { 
        const summary = await getEmailSummmary();
        displayMessage = summary;
      }
      fetchSummary().then(() => Alert.alert("Summary of Emails", displayMessage));


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
      makePhoneCall(phone);
    } else if (action.includes("Instagram")) {
      console.log("Instagram Feature Implementation");
      Linking.openURL("https://instagram.com");
    } else if (action.includes("Weather")) {
      console.log("Weather Feature Implementation");
      openWeatherPage("");
    } else {
      console.log(
        "Error occurred at Root Level, Error: Model returned an unknown action"
      );
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Generated Result</Text>
      <ScrollView style={globalStyles.resultContainer}>
        <Text style={globalStyles.resultText}>{displayMessage}</Text>
      </ScrollView>
      <Text style={globalStyles.title}>Test Actions</Text>
      <Pressable
        style={globalStyles.button}
        onPress={() => actionPerformer(action)}
      >
        <Text style={globalStyles.buttonText}>Perform Action</Text>
      </Pressable>
      <Pressable 
        style={globalStyles.buttonSecondary} 
        onPress={() => router.back()}
      >
        <Text style={globalStyles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
} 