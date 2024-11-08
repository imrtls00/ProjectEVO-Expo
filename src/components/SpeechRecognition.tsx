import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

export const useSpeechRecognition = (setInputValue: (text: string) => void, recognizing: boolean, setRecognizing: (val: boolean) => void) => {
  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    const newTranscript = event.results[0]?.transcript || "";
    setInputValue((prev) => newTranscript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleMicPress = async () => {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) return;
      ExpoSpeechRecognitionModule.start({ lang: "en-US" });
    }
  };

  return handleMicPress;
};
