import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { mockApi } from '@droppd/shared';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests notification permission, obtains an Expo push token, and registers
 * it against the signed-in user via the API (mock for now — see
 * backend/src/routes/devices.ts for the real endpoint this maps to).
 * Call once, after the user is authenticated.
 */
export function usePushNotifications(userId: string | null) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (!userId) return;

    registerForPushNotificationsAsync().then(({ token, status }) => {
      setPermissionStatus(status);
      if (token) {
        setExpoPushToken(token);
        mockApi.registerDeviceToken(userId, token, Platform.OS === 'ios' ? 'ios' : 'android');
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // A delivery-status update or driver-arrival alert arrived in the foreground.
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // The user tapped a notification — route to the relevant order here
      // once deep-linking is wired up (e.g. navigate to Tracking with orderId
      // from `response.notification.request.content.data`).
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userId]);

  return { expoPushToken, permissionStatus };
}

async function registerForPushNotificationsAsync(): Promise<{
  token: string | null;
  status: Notifications.PermissionStatus;
}> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  if (!Device.isDevice) {
    // Push tokens require a physical device or a real APNs/FCM-backed simulator config.
    return { token: null, status: 'undetermined' as Notifications.PermissionStatus };
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') {
    return { token: null, status };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  return { token, status };
}
