import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';
import React, { RefObject } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFeather = Animated.createAnimatedComponent(Feather);

type ButtonProps = {
  flatListRef: RefObject<FlatList>;
  flatListIndex: SharedValue<number>;
  dataLength: number;
};

export function Button({
  dataLength,
  flatListIndex,
  flatListRef,
}: ButtonProps) {

  // Inside the Button component
  const navigation = useNavigation();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      width: isLastScreen ? withSpring(140) : withSpring(60),
      height: 60,
      display: 'flex',
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(1) : withTiming(1),
      transform: [
        { translateX: isLastScreen ? withTiming(0) : withTiming(0) },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(1) : withTiming(0),
      transform: [
        { translateX: isLastScreen ? withTiming(0) : withTiming(-100) },
      ],
    };
  });

  const handleNextScreen = () => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    if (!isLastScreen) {
      flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
    } else {
      // Navigate to the next screen
      navigation.navigate('Home');
    }
  };

  return (
    <AnimatedPressable
      onPress={handleNextScreen}
      style={[styles.container, buttonAnimationStyle]}
    >
      <Animated.Text style={[styles.text, textAnimationStyle]}>
        Get Started
      </Animated.Text>

      <AnimatedFeather
        name="arrow-right"
        size={30}
        color={theme.colors.textHighlightColor}
        style={[styles.arrow, arrowAnimationStyle]}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundHighlightColor,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    
    borderColor: 'red',
    borderWidth: 1,
  },
  arrow: {
    position: 'relative',
    borderColor: 'red',
    borderWidth: 1,
  },
  text: {
    position: 'relative',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: theme.colors.textHighlightColor,
  },
});
