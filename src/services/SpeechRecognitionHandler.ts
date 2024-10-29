// src/services/SpeechRecognitionHandler.ts

import { addSpeechRecognitionListener, isRecognitionAvailable, supportsRecording } from 'expo-speech-recognition';
import { useState } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);

  const startSpeechRecognition = async (onResult: (text: string) => void) => {
    // Check if recognition is available and device supports it
    if (!isRecognitionAvailable() || !supportsRecording()) {
      alert('Speech recognition is not available on this device.');
      return;
    }

    // Start listening and handle results
    setIsListening(true);
    const listener = addSpeechRecognitionListener('onRecognitionResult', (event) => {
      const { text, isFinal } = event.results[0]; // Grab the first result
      if (isFinal) {
        setIsListening(false); // Stop listening once result is final
        onResult(text);
      }
    });

    return () => listener.remove(); // Clean up listener
  };

  return {
    isListening,
    startSpeechRecognition,
  };
};
