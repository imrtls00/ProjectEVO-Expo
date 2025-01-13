// onboarding/Onboarding.tsx
import React, { useEffect } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";

import Pagination from "@/src/components/Pagination";
import RenderItem from "./renderItem";
import { onboardingData } from "./data";
import { useGoogleAuth } from "@/src/services/googleAuth";
import styles from "./styles";

import Button from "@/src/components/OnboardingButton";

export default function Onboarding() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef<FlatList>();
  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const { request, response, promptAsync, fetchUserInfo, storeUserData } =
    useGoogleAuth();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken)
          .then((user) => {
            storeUserData(user);
            console.log("User signed in:", user);
            WebBrowser.dismissBrowser(); // ✅ Dismiss blank screen
            
            // ✅ Move to third slide after sign-in
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: 2, animated: true });
            }, 500);
          })
          .catch((error) => console.error("Failed to fetch user data:", error));
      }
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={onboardingData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <RenderItem
            index={index}
            item={item}
            x={x}
            promptAsync={promptAsync}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={useAnimatedScrollHandler({
          onScroll: (event) => {
            x.value = event.contentOffset.x;
          },
        })}
        scrollEventThrottle={16}
      />

      <View style={styles.footerContainer}>
        <Pagination data={onboardingData} screenWidth={SCREEN_WIDTH} x={x} />

        {/* <Button
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={onboardingData.length}
        /> */}
      </View>
    </View>
  );
}
