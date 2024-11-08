import { GoogleGenerativeAI } from "@google/generative-ai";
import { actionSchema } from "../constants/schema";

export const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_API_KEY || "no-api-key");

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: actionSchema,
  },
});
