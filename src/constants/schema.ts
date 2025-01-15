import { SchemaType } from "@google/generative-ai";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const currentDate = new Date().toISOString();
export const getUserName = async (): Promise<string | null> => {
  try {
    const userName = await AsyncStorage.getItem('UserName');
    return userName;
  } catch (error) {
    console.error('Error fetching UserName from AsyncStorage', error);
    return null;
  }
};

export const actionSchema = {
  description: "List of actions to be performed. Name of the user is: " + getUserName + " Current Date and Time is" + currentDate,
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      action: {
        type: SchemaType.STRING,
        description: "Type of action to perform",
        enum: [
          "SendEmail",
          "Call",
          "TextWhatsApp",
          "OpenApp",
          "MySchedule",
          "ScheduleMeeting",
          "CreateCalendarEvent",
          "Weather",
          "SummaryOfEmails",
          "SetAlarm",
          "SetReminder",
          "NotAvailable",
        ],
        nullable: false,
      },
      messageToShow: {
        type: SchemaType.STRING,
        description: "Message displayed to the user before action execution. For example 'SummaryOfEmails', instruct to press a button below.",
      },

      // Common Properties
      contactName: {
        type: SchemaType.STRING,
        description: "Name of the contact (Used in calls, emails, and WhatsApp)",
      },
      phoneNumber: {
        type: SchemaType.STRING,
        description: "Phone number of the contact (Used in calls and WhatsApp)",
      },
      email: {
        type: SchemaType.STRING,
        description: "Email address of the recipient",
      },
      subject: {
        type: SchemaType.STRING,
        description: "Subject or title - Used for emails, reminders, calendar events etc or whenever possible",
      },
      body: {
        type: SchemaType.STRING,
        description: "Message content for emails or WhatsApp",
      },
      appName: {
        type: SchemaType.STRING,
        description: "Name of the app to open",
      },
      city: {
        type: SchemaType.STRING,
        description: "City name for fetching weather",
      },
      eventName: {
        type: SchemaType.STRING,
        description: "Title of the calendar event or meeting",
      },
      duration: {
        type: SchemaType.INTEGER,
        description: "Duration for scheduled meetings or events in minutes",
      },
      time: {
        type: SchemaType.STRING,
        description: "Time for setting alarms, reminders, or scheduling",
      },
      countdownTimer: {
        type: SchemaType.BOOLEAN,
        description: "If true, show a sleek countdown timer for reminders/alarms"
      },
    },

    required: ["action", "messageToShow", "subject"]
  }
};
