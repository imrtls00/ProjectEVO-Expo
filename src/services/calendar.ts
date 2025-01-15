import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Requests calendar permissions from the user.
 * @returns {Promise<boolean>} Whether the permission was granted.
 */
export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      console.log('Calendar permission granted.');
      return true;
    } else {
      console.warn('Calendar permissions denied.');
      return false;
    }
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

/**
 * Fetches all available calendars.
 * @returns {Promise<Calendar.Entity[]>} List of calendars.
 */
export const getCalendars = async (): Promise<Calendar.Calendar[]> => {
  try {
    if (!(await requestCalendarPermissions())) return [];

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    console.log('Fetched calendars:', calendars.length);
    return calendars;
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return [];
  }
};

/**
 * Fetches events from a specific calendar within a time range.
 * @param calendarId The ID of the calendar.
 * @param from Start time (timestamp).
 * @param to End time (timestamp).
 * @returns {Promise<Calendar.Event[]>} List of events.
 */
export const getCalendarEvents = async (
  calendarId: string,
  from: number,
  to: number
): Promise<Calendar.Event[]> => {
  try {
    const events = await Calendar.getEventsAsync([calendarId], from, to);
    console.log(`Fetched ${events.length} events from calendar ID: ${calendarId}`);
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Creates a calendar event.
 * @param calendarId The ID of the calendar.
 * @param eventTitle Title of the event.
 * @param eventNotes Notes/details of the event.
 * @param startTime Start time (ISO string).
 * @param duration Duration in minutes.
 * @returns {Promise<string | null>} ID of the created event, or null on failure.
 */
export const createCalendarEvent = async (
  calendarId: string,
  eventTitle: string,
  eventNotes: string,
  startTime: string,
  duration: number
): Promise<string | null> => {
  try {
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: eventTitle,
      startDate,
      endDate,
      timeZone: 'GMT',
      notes: eventNotes,
    });

    console.log(`Event "${eventTitle}" created with ID: ${eventId}`);
    return eventId;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
};

/**
 * Stores a list of events in AsyncStorage.
 * @param events List of calendar events.
 * @returns {Promise<void>}
 */
export const storeEventsInAsyncStorage = async (events: Calendar.Event[]): Promise<void> => {
  try {
    const eventsToStore = events.map(event => ({
      id: event.id,
      title: event.title,
      notes: event.notes || '',
      startDate: event.startDate,
      endDate: event.endDate,
    }));

    await AsyncStorage.setItem('events', JSON.stringify(eventsToStore));
    console.log('Events stored successfully in AsyncStorage.');
  } catch (error) {
    console.error('Error storing events in AsyncStorage:', error);
  }
};

/**
 * Deletes a calendar event.
 * @param eventId The ID of the event to delete.
 * @returns {Promise<boolean>} Whether the deletion was successful.
 */
export const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
  try {
    await Calendar.deleteEventAsync(eventId);
    console.log(`Event with ID: ${eventId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return false;
  }
};