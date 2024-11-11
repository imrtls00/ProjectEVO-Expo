import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_API_KEY || "no-api-key");

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export const getEmailSummmary = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem("fetchedEmails");
      if (storedEmails) {
        const result = await model.generateContent("Summarize the following: " + storedEmails);
        const response = await result.response.text();

        return response;

      } else {
        console.log("No emails found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching and processing emails:", error);
    }
  };
