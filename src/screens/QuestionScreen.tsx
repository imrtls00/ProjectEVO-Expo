// src/screens/QuestionScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import QuestionGenerator from '../components/QuestionGenerator';
import { RootStackParamList } from '../types';

type QuestionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Question'>;

type Props = {
  navigation: QuestionScreenNavigationProp;
};

const QuestionScreen: React.FC<Props> = ({ navigation }) => {
  const [uiHierarchy, setUiHierarchy] = useState<any>(null); // Replace 'any' with a proper type for your UI hierarchy

  const captureScreen = () => {
    // Implement screen capture logic here
    // This should populate the uiHierarchy state
    console.log('Screen captured');
    setUiHierarchy({ /* mock UI hierarchy */ });
  };

  return (
    <View style={styles.container}>
      <Button title="Capture Current Screen" onPress={captureScreen} />
      {uiHierarchy && <QuestionGenerator uiHierarchy={uiHierarchy} />}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default QuestionScreen;