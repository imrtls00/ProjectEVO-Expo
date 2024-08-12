// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import AnswerScreen from './src/screens/AnswerScreen';
import ActionScreen from './src/screens/ActionScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
        <Stack.Screen name="Action" component={ActionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;