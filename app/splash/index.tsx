import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(150, width * 0.4);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    );

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  console.log("I was run inside Splash Screen");

  return (
    <View style={styles.container}>
      <AnimatedSvg width={LOGO_WIDTH} height={LOGO_WIDTH} viewBox="0 0 100 100" style={animatedStyle}>
        <Text
          fill="#FFFFFF"
          fontSize="60"
          fontWeight="bold"
          x="50"
          y="60"
          textAnchor="middle"
        >
          EVO
        </Text>
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 