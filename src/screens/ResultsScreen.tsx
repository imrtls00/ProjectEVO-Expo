// src/screens/ResultsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Result</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{result}</Text>
      </ScrollView>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010616',
    padding: 20,
  },
  title: {
    color: '#C6C9CF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultText: {
    color: '#B2B4B9',
    fontSize: 18,
    lineHeight: 24,
  },
});

export default ResultsScreen;
