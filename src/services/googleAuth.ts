import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export interface GoogleUser {
  name: string;
  email: string;
}

export const useGoogleAuth = () => {

  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.imrtls00.projectevo://auth",
  });
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_OAUTH,
    scopes: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
  });  

  const fetchUserInfo = async (accessToken: string): Promise<GoogleUser> => {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error(
        `Failed to fetch user info: ${userInfoResponse.status} ${userInfoResponse.statusText}`
      );
    }

    return userInfoResponse.json();
  };

  const storeUserData = async (userData: GoogleUser) => {
    await AsyncStorage.setItem("googleUser", JSON.stringify(userData));
  };

  const getUserData = async (): Promise<GoogleUser | null> => {
    const storedUser = await AsyncStorage.getItem("googleUser");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("googleUser");
    await AsyncStorage.removeItem("accessToken");
  };

  return {
    request,
    response,
    promptAsync,
    fetchUserInfo,
    storeUserData,
    getUserData,
    signOut,
  };
};