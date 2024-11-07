// App.tsx

import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';

import * as Font from 'expo-font';
import { Urbanist_400Regular, Urbanist_500Medium } from '@expo-google-fonts/urbanist';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen';
import {Onboarding} from './src/screens/Onboarding';
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { RootStackParamList } from './src/types';
import MyCalendar from './src/screens/MyCalendar';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Urbanist-Regular':Urbanist_400Regular,
        'Urbanist-Medium': Urbanist_500Medium,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);
  return (
    // App's navigation or main component
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Results" component={ResultsScreen}  initialParams={{ result: '' }} options={{ headerShown: false }}/>
        <Stack.Screen name="MyCalendar" component={MyCalendar} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;