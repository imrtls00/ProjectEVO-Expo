import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import * as Calendar from 'expo-calendar';
import { globalStyles } from '@/src/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function CalendarScreen() {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const fetchedCalendars = await Calendar.getCalendarsAsync();
          setCalendars(fetchedCalendars);
        } else {
          alert("Calendar permission is required to access your calendars. Please enable it in your settings.");
          console.error("Calendar permission denied");
        }
      } catch (error) {
        console.error("Error fetching calendars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  const fetchEvents = async (calendarId: string, from: number, to: number) => {
    try {
      const fetchedEvents = await Calendar.getEventsAsync([calendarId], from, to);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading calendars...</Text>
      </View>
    );
  }
  
  const filteredCalendars = calendars.filter(calendar => calendar.name === "University Schedule");

  const storeEventsInAsyncStorage = async (events) => {
    try {
      const eventsToStore = events.map(event => ({
        id: event.id,
        title: event.title,
        notes: event.notes,
        startDate: event.startDate,
        endDate: event.endDate,
      }));
      await AsyncStorage.setItem('events', JSON.stringify(eventsToStore));
      console.log('Events stored successfully in AsyncStorage.');
    } catch (error) {
      console.error('Error storing events in AsyncStorage:', error);
    }
  };

  storeEventsInAsyncStorage(events);

  return (
    <View style={globalStyles.container}>
      <Button
        title="Go Back"
        onPress={() => router.navigate("(tabs)/settings")}
      />
      <Text style={globalStyles.title}>Calendars</Text>
      <FlatList
        data={filteredCalendars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.calendarItem}>
            <Text>{item.name}</Text>
            <Button
              title="Fetch Events"
              onPress={() => fetchEvents(item.id, Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000)}
            />
          </View>
        )}
      />
      <Text style={globalStyles.title}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.eventItem}>
            <Text>{item.title} - {item.notes}</Text>
            <Text>{new Date(item.startDate).toLocaleString()} - {new Date(item.endDate).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}