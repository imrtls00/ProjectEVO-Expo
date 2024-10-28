// src/screens/OnboardingScreen.tsx

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { colors, size, globalStyles } from '../Styles/globalStyles'; // Import global styles

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: require('../assets/onboarding-1.png'),
    title: 'Talk to EVO like a friend.',
    description: 'Ask questions, set reminders, or complete tasks with just your voice.',
    buttonText: 'Next →',
  },
  {
    id: 2,
    image: require('../assets/onboarding-2.png'),
    title: 'Ready to experience the future of productivity?',
    description: "Let's go!",
    buttonText: 'Get Started →',
  },
  {
    id: 3,
    image: require('../assets/onboarding-3.png'),
    title: 'Stay organized and focused.',
    description: 'EVO helps you stay on top of your tasks and goals.',
    buttonText: 'Get Started →',
  }
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<typeof Carousel | null>(null);

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.bottomContainer}>
          <View style={styles.paginationContainer}>
            {slides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.paginationDot,
                  dotIndex === activeSlide ? styles.paginationDotActive : null,
                ]}
              />
            ))}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (index === slides.length - 1) {
                navigation.navigate('Home');
              } else {
                carouselRef.current?.next();
              }
            }}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Carousel
        ref={carouselRef}
        width={screenWidth}
        height={screenHeight}
        data={slides}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index)}
        pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    padding: 0,
    width: screenWidth,
    height: screenHeight
  },
  slide: {
    flex: 1,
  },
  image: {
    width: screenWidth,
    height: screenHeight / 2,
    resizeMode: 'cover',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: colors.Theme,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: size['32'],
    fontWeight: '500',
    color: colors.Heading,
    textAlign: 'left',
    marginBottom: 10,
  },
  description: {
    fontSize: size['32'],
    color: colors.Text,
    textAlign: 'left',
  },
  button: {
    backgroundColor: colors.Theme,
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
