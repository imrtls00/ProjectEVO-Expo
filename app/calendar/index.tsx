import React, { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus, StyleSheet, View, Text, Button, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function MyCalendar() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <CalendarPermissions />
      <Button title="Create a new calendar" onPress={createCalendar} />
    </View>
  );
}

const CalendarPermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState("checking...");
  
  const appState = useRef(AppState.currentState);

  // Function to check calendar permissions
  const checkCalendarPermissions = async () => {
    console.log("Checking Calendar Permissions...");
    const { status } = await Calendar.getCalendarPermissionsAsync();
    console.log("Current Permission Status:", status);
    setPermissionStatus(status);
  };

  // Request calendar permissions if they aren't granted
  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
  };

  // Check permissions on startup
  useEffect(() => {
    checkCalendarPermissions();
  }, []);

  // Monitor app state changes to update permissions when the app becomes active
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      await checkCalendarPermissions();
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Calendar Permission Status: {permissionStatus}</Text>
      {permissionStatus !== 'granted' ? (
        <Button title="Request Calendar Permission" onPress={requestCalendarPermissions} />
      ) : (
        <Text>Permission Granted!</Text>
      )}
    </View>
  );
};


async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar', type: 'local' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
