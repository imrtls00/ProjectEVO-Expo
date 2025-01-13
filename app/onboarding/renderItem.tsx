// onboarding/RenderItem.tsx
import React from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';
import { Data } from '@/src/constants/data';

import { useRouter } from "expo-router"; // ✅ Import router

const renderItem = ({
  item,
  index,
  x,
  promptAsync,
}: {
  item: Data;
  index: number;
  x: SharedValue<number>;
  promptAsync: () => void;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_WIDTH * 0.8,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const router = useRouter(); // ✅ Get router instance

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <Animated.Image source={item.image} style={imageAnimatedStyle} />

      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemText}>{item.text}</Text>

        {/* Show Google Sign-In Button only on Slide #2 */}
        {index === 1 && (
          <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            console.log("Google Sign-In button pressed!"); // ✅ Debug log
            promptAsync().catch((error) => console.error("Error with Google Sign-In:", error));
          }}
        >
          <AntDesign name="google" size={24} color="white" />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>        
        )}

        {/* Slide #3 */}
        {index === 2 && (
          <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            console.log("I'm on last onboarding screen"); // ✅ Debug log
            // Navigate to the home screen
            router.navigate("(tabs)");
          }}
        >
          <Text style={styles.googleButtonText}>Get Started</Text>
        </TouchableOpacity>        
        )}
      </Animated.View>
    </View>
  );
};

export default renderItem;
