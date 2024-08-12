// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
// import SummaryScreen from './src/screens/SummaryScreen';
// import QuestionScreen from './src/screens/QuestionScreen';
// import ActionScreen from './src/screens/ActionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Action" component={ActionScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}