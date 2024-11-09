import React, { useState, useEffect } from "react";
import { View, Text, Switch, Pressable, Alert } from "react-native";
import { globalStyles } from "@/src/Styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {
  const router = useRouter();
  const [submitPromptAutomatically, setSubmitPromptAutomatically] =
    useState(false);
  const [performActionAutomatically, setPerformActionAutomatically] =
    useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // clientId: "YOUR_EXPO_CLIENT_ID",
    // iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_OAUTH,
    // webClientId: "YOUR_WEB_CLIENT_ID",
    scopes: ["profile", "email"],
  });

  // Define the interface for Google user data
  interface GoogleUser {
    name: string;
    email: string;
    // Add other properties if needed
  }

  // Update the state type for googleUser
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const getGoogleUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("googleUser");
        if (storedUser) {
          setGoogleUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving Google user data:", error);
      }
    };
    getGoogleUser();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const fetchUserInfo = async () => {
        try {
          if (authentication) {
            // Check if authentication is not null
            const userInfoResponse = await fetch(
              "https://www.googleapis.com/userinfo/v2/me",
              {
                headers: {
                  Authorization: `Bearer ${authentication.accessToken}`,
                },
              }
            );

            if (!userInfoResponse.ok) {
              throw new Error(
                `Failed to fetch user info: ${userInfoResponse.status} ${userInfoResponse.statusText}`
              );
            }

            const userInfo = await userInfoResponse.json();
            setGoogleUser(userInfo);
            await AsyncStorage.setItem("googleUser", JSON.stringify(userInfo));
          } else {
            console.error("Authentication is null");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }
  }, [response]);

  const handleToggleSubmitPrompt = () => {
    setSubmitPromptAutomatically((prev) => !prev);
    // Save the preference to AsyncStorage if needed
    AsyncStorage.setItem(
      "submitPromptAutomatically",
      JSON.stringify(!submitPromptAutomatically)
    );
  };

  const handleTogglePerformAction = () => {
    setPerformActionAutomatically((prev) => !prev);
    // Save the preference to AsyncStorage if needed
    AsyncStorage.setItem(
      "performActionAutomatically",
      JSON.stringify(!performActionAutomatically)
    );
  };

  const handleShowOnboarding = () => {
    router.push("/onboarding"); // Navigate to the onboarding screen
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete Data",
      "Are you sure you want to delete/reset all your data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Clear AsyncStorage or reset your data here
            await AsyncStorage.clear();
            Alert.alert("Data Deleted", "All your data has been reset.");
          },
        },
      ]
    );
  };

  const handleGoogleSignIn = async () => {
    await promptAsync();
  };

  const handleGoogleSignOut = async () => {
    setGoogleUser(null);
    await AsyncStorage.removeItem("googleUser");
    // Add any other sign-out logic if needed (e.g., revoking tokens)
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>

      <View style={globalStyles.settingItem}>
        <Text style={globalStyles.text}>
          Submit prompt automatically when using voice input
        </Text>
        <Switch
          value={submitPromptAutomatically}
          onValueChange={handleToggleSubmitPrompt}
        />
      </View>

      <View style={globalStyles.settingItem}>
        <Text style={globalStyles.text}>
          Perform the action automatically on results screen
        </Text>
        <Switch
          value={performActionAutomatically}
          onValueChange={handleTogglePerformAction}
        />
      </View>

      <Pressable style={globalStyles.button} onPress={handleShowOnboarding}>
        <Text style={globalStyles.buttonText}>Show Onboarding Screen</Text>
      </Pressable>

      <Pressable style={globalStyles.buttonDanger} onPress={handleDeleteData}>
        <Text style={globalStyles.buttonText}>Delete / Reset all my data</Text>
      </Pressable>

      {googleUser ? (
        <View style={globalStyles.settingItem}>
          <Pressable
            style={globalStyles.buttonDanger}
            onPress={handleGoogleSignOut}
          >
            <Text style={globalStyles.buttonText}>
              Disconnect Google Account
            </Text>
          </Pressable>
          <Text style={globalStyles.text}>
            Account Linked: {googleUser?.name} ({googleUser?.email})
          </Text>
        </View>
      ) : (
        <Pressable
          style={globalStyles.button}
          onPress={handleGoogleSignIn}
          disabled={!request}
        >
          <Text style={globalStyles.buttonText}>Sign in with Google</Text>
        </Pressable>
      )}
    </View>
  );
}
