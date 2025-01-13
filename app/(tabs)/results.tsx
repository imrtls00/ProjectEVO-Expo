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
import { globalStyles } from "@/src/Styles/globalStyles";
import { useResults } from "@/src/context/ResultsContext";
import { model } from "@/src/services/generativeAI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEmailSummmary } from "@/src/services/getEmailSummary";
import Markdown from "react-native-markdown-display";
import { appList, openApp } from "@/src/services/appList"; // Import functions from appList.ts

import { scheduleAlarm, stopAlarm, removeAlarm } from "expo-alarm-module";

export default function ResultsScreen() {
  const router = useRouter();
  const { results, setResults } = useResults();

  if (!results) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>No Results</Text>
        <Text style={globalStyles.text}>
          Try asking something from the home screen.
        </Text>
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
  const appName = resultObj[0].appName;

  function actionPerformer(action: string) {
    const openGmailApp = async (
      email: string,
      subject: string,
      body: string
    ) => {
      const gmailUrl = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(gmailUrl);
    };

    const makePhoneCall = async (phoneNumber: string) => {
      const phoneUrl = `tel:${phoneNumber}`;
      await Linking.openURL(phoneUrl);
    };

    const sendWhatsAppMessage = async (
      phoneNumber: string,
      message: string
    ) => {
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

    // const setAlarm = async (hour: number, minute: number, message: string) => {
    //   if (Platform.OS === "android") {
    //     const alarmIntent = `intent://alarm`;
    //     const canOpen = await Linking.canOpenURL(alarmIntent);
    //     if (canOpen) {
    //       await Linking.openURL(alarmIntent);
    //     } else {
    //       Alert.alert("Error", "Unable to set alarm");
    //     }
    //   } else {
    //     Alert.alert("Error", "Setting alarms is only supported on Android");
    //   }
    // };

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
      displayMessage =
        "Sorry, this feature is under-development and is currently unavailable in beta-mode.";
    } else if (action.includes("SendEmail")) {
      console.log("Send Email feature implementation");
      openGmailApp(email, subject, body);
    } else if (action.includes("SummaryOfEmails")) {
      // Linking.openURL("https://gmail.app.goo.gl");
      async function fetchSummary() {
        const summary = await getEmailSummmary();
        displayMessage = summary;
      }
      fetchSummary().then(() =>
        Alert.alert("Summary of Emails", displayMessage)
      );
    } else if (action.includes("ScheduleMeeting")) {
      console.log("Schedule Meeting feature implementation");
      gotoCalendar(subject, body);
    // } else if (action.includes("SetAlarm")) {
    //   console.log("Set Alarm feature implementation");
    //   setAlarm(10, 30, subject);
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
    } else if (action.includes("OpenApp")) {
      console.log("Open App feature implementation");
      console.log(resultObj[0].appName);
      const openAppByName = async (appName: string) => {
        try {
          // Get the list of installed apps
          const apps = await appList();

          // Log installed apps to confirm structure
          console.log("Installed Apps:", apps);

          // Ensure apps array is valid
          if (!Array.isArray(apps) || apps.length === 0) {
            console.error("No installed apps found.");
            return;
          }

          // Find the app by matching the `label` (case-insensitive)
          const matchedApp = apps.find(
            (app) =>
              app?.label && app.label.toLowerCase() === appName.toLowerCase()
          );

          if (matchedApp) {
            console.log(`Opening app: ${matchedApp.label}`);
            await openApp(matchedApp.packageName); // Open app using package name
          } else {
            console.error(`App "${appName}" is not installed.`);
          }
        } catch (error) {
          console.error("Error fetching or opening app:", error);
        }
      };
      openAppByName(resultObj[0].appName);
    } else if (action.includes("SetReminder") || action.includes("SetAlarm")) {
      console.log("Reminder feature implementation");
      const dismissAlarm = () => {
        console.log("Stopping and removing alarm...");
    
        // Stop any active alarm sound
        stopAlarm();
    
        // Remove the scheduled alarm by UID
        removeAlarm("alarm10sec");
    
        console.log("Alarm dismissed.");
    };
      const setAlarmIn10Seconds = () => {
        const newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + 10); // Set alarm for 10 seconds later

        scheduleAlarm({
          uid: "alarm10sec",
          day: newDate,
          title: "Wake Up!",
          description: "This is an auto-set alarm after 10 seconds.",
          snoozeInterval: 5,
          repeating: false, // No repetition
          active: true,
        } as any);

        console.log("Alarm set for 10 seconds later!");

            // Auto-dismiss alarm in 15 seconds (5 sec after it rings)
    setTimeout(() => {
      dismissAlarm();
  }, 15000); // 15,000ms = 15 seconds
      };
      setAlarmIn10Seconds();

    } else if (action.includes("CreateCalendarEvent")) {
      console.log("Create Calendar Event feature implementation");
      gotoCalendar(subject, body);
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
