import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_API_KEY || "no-api-key"
);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const getEmailSummmary = async () => {
  try {
    // await fetchEmails();
    const storedEmails = await AsyncStorage.getItem("fetchedEmails");

    if (storedEmails) {
      console.log("Generating Email Summary...");

      const result = await model.generateContent(
        "Summarize the following text, say something like here's the generated summary, ignore the id, thread id and other relevant data, use list formatting, (don't use the markdown format): " + storedEmails
      );
      const response = await result.response.text();

      console.log("Email Summary Generated:", response);

      return response;
    } else {
      console.log("No emails found in AsyncStorage.");
    }
  } catch (error) {
    console.error("Error fetching and processing emails:", error);
  }
};

const fetchEmails = async () => {
  let accessToken;
    // Attempt to retrieve accessToken from AsyncStorage if not available
    const storedAccessToken = await AsyncStorage.getItem("accessToken");
    if (!storedAccessToken) {
      Alert.alert("Error", "Authentication is not available.");
      return;
    }
    accessToken = storedAccessToken;

  try {
    const emailResponse = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!emailResponse.ok) {
      throw new Error(
        `Failed to fetch emails: ${emailResponse.status} ${emailResponse.statusText}`
      );
    }

    const emailData = await emailResponse.json();
    const completeEmails = await Promise.all(
      emailData.messages.map(async (message) => {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!messageResponse.ok) {
          throw new Error(
            `Failed to fetch message body: ${messageResponse.status} ${messageResponse.statusText}`
          );
        }

        const messageBody = await messageResponse.json();
        return { ...message, body: messageBody };
      })
    );
    console.log("Fetched Emails:", completeEmails);

    // Store emails in AsyncStorage
    await AsyncStorage.setItem("fetchedEmails", JSON.stringify(completeEmails));
    Alert.alert("Success", "Fetched emails and stored in AsyncStorage.");
  } catch (error) {
    console.error("Error fetching emails:", error);
    Alert.alert("Error", "Failed to fetch emails.");
  }
};
