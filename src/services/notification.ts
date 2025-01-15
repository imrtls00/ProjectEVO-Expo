import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

/**
 * Handles notification settings.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Requests permission for notifications.
 * @returns {Promise<boolean>} Whether permission was granted.
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    Alert.alert('Error', 'Notifications are not supported on simulators.');
    return false;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Error', 'Notification permissions denied.');
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedules a local notification.
 * @param title Title of the notification.
 * @param body Body message of the notification.
 * @param secondsFromNow Time in seconds after which the notification should trigger.
 */
export const scheduleNotification = async (
  title: string,
  body: string,
  secondsFromNow: number = 0
) => {
  if (!(await requestNotificationPermissions())) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: secondsFromNow > 0 ? { seconds: secondsFromNow } : null,
    });
    console.log(`Notification scheduled: ${title}`);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Cancels all scheduled notifications.
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications canceled.');
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

/**
 * Listens for incoming notifications.
 * @param callback Function to execute when a notification is received.
 */
export const setNotificationListener = (callback: (response: Notifications.NotificationResponse) => void) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};
