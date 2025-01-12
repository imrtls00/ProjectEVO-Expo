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
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_OAUTH,
    scopes: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });

  interface GoogleUser {
    name: string;
    email: string;
  }

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

  const fetchEmails = async () => {
    if (!googleUser) {
      Alert.alert("Error", "You need to be signed in to fetch emails.");
      return;
    }

    let accessToken;
    if (!response || response.type !== "success" || !response.authentication) {
      // Attempt to retrieve accessToken from AsyncStorage if not available
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      if (!storedAccessToken) {
        Alert.alert("Error", "Authentication is not available.");
        return;
      }
      accessToken = storedAccessToken;
    } else {
      accessToken = response.authentication.accessToken;
      // Save accessToken to AsyncStorage for future use
      await AsyncStorage.setItem("accessToken", accessToken);
    }

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
      const completeEmails = await Promise.all(emailData.messages.map(async (message) => {
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
      }));
      console.log("Fetched Emails:", completeEmails);

      // Store emails in AsyncStorage
      await AsyncStorage.setItem("fetchedEmails", JSON.stringify(completeEmails));
      Alert.alert("Success", "Fetched emails and stored in AsyncStorage.");
    } catch (error) {
      console.error("Error fetching emails:", error);
      Alert.alert("Error", "Failed to fetch emails.");
    }
  };

  const getEmails = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem("fetchedEmails");
      if (storedEmails) {
        const emails = JSON.parse(storedEmails);
        console.log("Fetched Emails:", emails.messages[0].threadId);
        Alert.alert("Success", "Fetched emails from AsyncStorage.");
        return emails;
      } else {
        console.log("No emails found in AsyncStorage.");
        Alert.alert("Error", "No emails found in AsyncStorage.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching emails from AsyncStorage:", error);
      Alert.alert("Error", "Failed to fetch emails from AsyncStorage.");
      return [];
    }
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

      <Pressable style={globalStyles.button} onPress={ () => router.push("/calendar")}>
        <Text style={globalStyles.buttonText}>Goto Calendar</Text>
      </Pressable>

      <Pressable style={globalStyles.button} onPress={fetchEmails}>
        <Text style={globalStyles.buttonText}>Fetch First 10 Emails</Text>
      </Pressable>

      <Pressable style={globalStyles.button} onPress={ () => router.push("/accessiblity")}>
        <Text style={globalStyles.buttonText}>Screen Reader Test</Text>
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