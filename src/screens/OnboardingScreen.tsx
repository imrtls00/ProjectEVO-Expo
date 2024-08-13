// src/screens/OnboardingScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
};

const { width: screenWidth } = Dimensions.get('window');

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
  // Add more slides here if needed
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
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
              carouselRef.current?.snapToNext();
            }
          }}
        >
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={slides}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
});

export default OnboardingScreen;