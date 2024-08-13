// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS } from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(150, width * 0.4);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const SplashScreen: React.FC<Props> = ({ navigation }) => {
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
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;