import React, { useEffect, useState } from "react";
import {
  View,
  Linking,
  Alert,
  Text,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "@/src/Styles/globalStyles";
import { useResults } from "@/src/context/ResultsContext";
import { getEmailSummmary } from "@/src/services/getEmailSummary";
import {
  getCalendars,
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/src/services/calendar";
import {
  scheduleAlarm,
  removeAllAlarms,
  removeAlarm,
  stopAlarm,
} from "expo-alarm-module";
import { scheduleNotification } from "@/src/services/notification";
import Markdown from "react-native-markdown-display";
import { appList, openApp } from "@/src/services/getAppList";

export default function ResultsScreen() {
  const router = useRouter();
  const { results } = useResults();
  const [contacts, setContacts] = useState([]);
  const [apps, setApps] = useState([]);
  const [city, setCity] = useState("");
  const [dynamicContent, setDynamicContent] = useState<React.ReactNode>(null);
  const [performActionAutomatically, setPerformActionAutomatically] =
    useState(false);
  const [emailInput, setEmailInput] = useState(""); // Store user input for email
  const [alarmActive, setAlarmActive] = useState(false);

  useEffect(() => {
    /** Fetch stored contacts, app list, and city from AsyncStorage */
    async function fetchStoredData() {
      try {
        const storedContacts = await AsyncStorage.getItem("contacts");
        const storedApps = await AsyncStorage.getItem("appList");
        const storedCity = await AsyncStorage.getItem("city");
        const storedAutoAction = await AsyncStorage.getItem(
          "performActionAutomatically"
        );

        if (storedContacts) setContacts(JSON.parse(storedContacts));
        if (storedApps) setApps(JSON.parse(storedApps));
        if (storedCity) setCity(storedCity);
        if (storedAutoAction !== null)
          setPerformActionAutomatically(JSON.parse(storedAutoAction));

        console.log("Loaded AsyncStorage data successfully.");
      } catch (error) {
        console.error("Error fetching stored data:", error);
      }
    }

    fetchStoredData();
  }, []);

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
  const action = resultObj[0]?.action || "";
  let displayMessage = resultObj[0]?.messageToShow || "";
  const body = resultObj[0]?.body || "";
  const subject = resultObj[0]?.subject || "";
  const contactName = resultObj[0]?.contactName || "";
  const appName = resultObj[0]?.appName || "";

  console.log("Received Action:", action);

  /** Finds a contact with partial matching */
  const findContact = (name: string) => {
    return contacts.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  /** Finds an email from stored contacts */
  const getEmail = (name: string) => {
    const contact = findContact(name);
    return contact?.emails?.[0]?.email || null;
  };

  /** Finds a phone number from stored contacts */
  const getPhoneNumber = (name: string) => {
    const contact = findContact(name);
    return contact?.phoneNumbers?.[0]?.number || null;
  };

  /** Finds an app package name from stored apps */
  const getAppPackage = (name: string) => {
    const app = apps.find((a) => a.label.toLowerCase() === name.toLowerCase());
    return app?.packageName || null;
  };

  /** Send an email */
  const sendEmail = async () => {
    let email = getEmail(contactName);
    if (!email) {
      console.log(`No email found for ${contactName}`);
      return;
    }

    const gmailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    await Linking.openURL(gmailUrl);
  };

  /** Show weather in the dynamic view */
  const showWeather = () => {
    if (!city) {
      Alert.alert("Error", "City not found. Please set it in settings.");
      return;
    }
    setDynamicContent(
      <View>
        <Text style={globalStyles.text}>Weather in {city}:</Text>
        <Text>Fetching weather...</Text>
      </View>
    );
  };

  /** Display email summary */
  const showEmailSummary = async () => {
    const summary = await getEmailSummmary();
    setDynamicContent(<Text style={globalStyles.text}>{summary}</Text>);
  };

  /** Schedule a meeting and display event details */
  const scheduleMeeting = async () => {
    const calendars = await getCalendars();
    if (!calendars.length) {
      Alert.alert("Error", "No calendars found.");
      return;
    }

    const duration = resultObj[0]?.duration || 60;

    const calendarId = calendars[8].id;
    const eventId = await createCalendarEvent(
      calendarId,
      subject,
      body,
      new Date().toISOString(),
      duration
    );

    if (eventId) {
      setDynamicContent(
        <View>
          <Text style={globalStyles.text}>Meeting Scheduled! {subject}</Text>
          <Text style={globalStyles.text}>Title: {subject}</Text>
          <Text style={globalStyles.text}>Duration: {duration} minutes</Text>
          <Pressable
            style={globalStyles.buttonDanger}
            onPress={async () => {
              await deleteCalendarEvent(eventId);
              setDynamicContent(
                <Text style={globalStyles.text}>Meeting Canceled</Text>
              );
            }}
          >
            <Text style={globalStyles.buttonText}>Cancel Meeting</Text>
          </Pressable>
        </View>
      );
    }
  };

  /** Make a phone call */
  const makePhoneCall = async () => {
    const phoneNumber = getPhoneNumber(contactName);
    console.log("Calling:", contactName, "Phone Number:", phoneNumber);
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found.");
      return;
    }
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  /** Display user's calendar events */
  const showMySchedule = async () => {
    const calendars = await getCalendars();
    if (!calendars.length) {
      Alert.alert("Error", "No calendars found.");
      return;
    }

    const events = await getCalendarEvents(
      calendars[6].id,
      Date.now(),
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    setDynamicContent(
      <ScrollView>
        {events.map((event, index) => (
          <Text style={globalStyles.text} key={index}>
            {event.title} - {new Date(event.startDate).toLocaleString()}
          </Text>
        ))}
      </ScrollView>
    );
  };

  /** Send WhatsApp message */
  const sendWhatsAppMessage = async () => {
    const phoneNumber = getPhoneNumber(contactName);
    if (!phoneNumber) {
      Alert.alert("Error", "WhatsApp contact not found.");
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      body
    )}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      Alert.alert("Error", "WhatsApp is not installed on this device.");
    }
  };

  /** Open a specific app */
  const openAppByName = async () => {
    const packageName = getAppPackage(appName);
    console.log("Opening App:", appName, "Package:", packageName);
    if (!packageName) {
      Alert.alert("Error", `App "${appName}" is not installed.`);
      return;
    }
    await openApp(packageName);
  };

  /** Set an alarm */
  const setAlarm = () => {
    setAlarmActive(true);
    scheduleAlarm({
      uid: "alarm1",
      day: new Date(Date.now() + 10 * 1000),
      title: "Wake Up!",
      description: "This is an alarm reminder.",
      snoozeInterval: 5,
      repeating: false,
      active: true,
    });

    // Auto-dismiss alarm in 15 seconds (5 sec after it rings)
    setTimeout(() => {
      callStopAlarm();
    }, 15000); // 15,000ms = 15 seconds

    setDynamicContent(
      <View>
        <Text style={globalStyles.text}>Alarm Set!</Text>
        <Pressable onPress={callStopAlarm} style={globalStyles.buttonDanger}>
          <Text style={globalStyles.buttonText}>Stop Alarm</Text>
        </Pressable>
      </View>
    );
  };

  /** Stop an active alarm */
  const callStopAlarm = () => {
    stopAlarm();
    removeAlarm("alarm1");
    removeAllAlarms();
    setAlarmActive(false);
    setDynamicContent(<Text style={globalStyles.text}>Alarm Stopped</Text>);
  };

  /** Perform action based on type */
  const actionPerformer = async () => {
    switch (action) {
      case "SendEmail":
        await sendEmail();
        break;
      case "Call":
        await makePhoneCall();
        break;
      case "OpenApp":
        await openAppByName();
        break;
      case "Weather":
        showWeather();
        break;
      case "TextWhatsApp":
        await sendWhatsAppMessage();
        break;
      case "SummaryOfEmails":
        await showEmailSummary();
        break;
      case "SetAlarm":
      case "SetReminder":
        setAlarm();
        break;
      case "CreateCalendarEvent":
      case "ScheduleMeeting":
        await scheduleMeeting();
        break;
      case "MySchedule":
        await showMySchedule();
        break;
      default:
        Alert.alert("Error", "This action is not supported.");
        break;
    }
  };

  // If `performActionAutomatically` is true, execute action immediately
  useEffect(() => {
    if (performActionAutomatically) {
      actionPerformer();
    }
  }, [results]);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Generated Result</Text>
      <ScrollView style={globalStyles.resultContainer}>
        <Text style={globalStyles.resultText}>{displayMessage}</Text>
        {dynamicContent}
      </ScrollView>

      {/* Show action button only if not auto-performing */}
      {performActionAutomatically && (
        <Pressable style={globalStyles.button} onPress={actionPerformer}>
          <Text style={globalStyles.buttonText}>Perform Action</Text>
        </Pressable>
      )}

      <Pressable
        style={globalStyles.buttonSecondary}
        onPress={() => router.back()}
      >
        <Text style={globalStyles.buttonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}
