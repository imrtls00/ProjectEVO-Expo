// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Splash Screen"
        onPress={() => navigation.navigate('Splash')}
      />
      <Button
        title="Screen Summary"
        onPress={() => navigation.navigate('Summary')}
      />
      <Button
        title="Generate Questions"
        onPress={() => navigation.navigate('Question')}
      />
      <Button
        title="Answer Questions"
        onPress={() => navigation.navigate('Answer')}
      />
      <Button
        title="Map Actions"
        onPress={() => navigation.navigate('Action')}
      />
    </View>
  );
}