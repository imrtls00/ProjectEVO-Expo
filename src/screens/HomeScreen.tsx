// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const HomeScreen = () => {
  const prompts = [
    { id: '1', text: 'Read a Summary of My Emails' },
    { id: '2', text: 'Schedule a Meeting With Boss' },
    { id: '3', text: 'Wake Me Up in 4 hours' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi! 👋🏼 
        {'\n'}
        What can EVO
        {'\n'}
        do for you?
      </Text>

      <Text style={styles.subHeading}>
        Quick Prompts <Text style={styles.divider}>--------------------------------</Text>
      </Text>
      <FlatList
        horizontal
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>{item.text}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.cardContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What do you wanna do?"
          placeholderTextColor="#616A73"
        />
        <TouchableOpacity style={styles.voiceButton}>
          <Text style={styles.voiceText}>🎤</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 60,
    marginTop: 60,
    marginBottom: 20,
  },

  subHeading: {
    color: '#B2B4B9',
    fontSize: 24,
    fontWeight: 'medium',
    marginTop: 40,
    marginBottom: 20,
  },

  divider: {
    color: '#0061FF',
    height: 2,
    width: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#010F2D',
    padding: 32,
    borderRadius: 32,
    marginRight: 12,
    height: 138,
    width: 200,
  },
  cardText: {
    color: '#999FAB',
    fontSize: 20,
    fontWeight: 'medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0061FF',
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 32,
    paddingRight: 4,
    paddingVertical: 4,
    backgroundColor: '#010616',
  },
  input: {
    flex: 1,
    color: '#F0F0F0',
    fontSize: 18,
  },
  voiceButton: {
    backgroundColor: '#0061FF',
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
  },
  voiceText: {
    color: '#FFF',
    fontSize: 20,
  },
});

export default HomeScreen;
