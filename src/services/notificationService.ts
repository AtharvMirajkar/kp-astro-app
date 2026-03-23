/**
 * src/services/notificationService.ts
 *
 * Handles FCM token, permissions, and listeners.
 * Foreground messages are now displayed via Notifee instead of Alert.
 */

import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { displayNotification } from './notifeeService';

const DEVICE_ID_KEY = '@kp_device_id';
const FCM_TOKEN_KEY = '@kp_fcm_token';

// ─── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const status = await messaging().requestPermission();
    return (
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const { PermissionsAndroid } = require('react-native');
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

// ─── Device ID ────────────────────────────────────────────────────────────────

export async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = await DeviceInfo.getUniqueId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// ─── FCM Token ────────────────────────────────────────────────────────────────

export async function getFCMToken(): Promise<string | null> {
  try {
    const hasPermission = await messaging().hasPermission();
    if (
      hasPermission !== messaging.AuthorizationStatus.AUTHORIZED &&
      hasPermission !== messaging.AuthorizationStatus.PROVISIONAL
    ) {
      return null;
    }
    const token = await messaging().getToken();
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error('[FCM] Failed to get token:', error);
    return null;
  }
}

export async function getCachedFCMToken(): Promise<string | null> {
  return AsyncStorage.getItem(FCM_TOKEN_KEY);
}

// ─── Foreground listener ──────────────────────────────────────────────────────
// Uses Notifee to display a styled notification instead of a plain Alert.

export function listenForForegroundMessages(
  onMessage?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(async remoteMessage => {
    console.log('[FCM] Foreground message:', remoteMessage);

    // Show styled Notifee notification
    await displayNotification(remoteMessage);

    // Optional custom handler (e.g. update badge, refresh a screen)
    onMessage?.(remoteMessage);
  });
}

// ─── Token refresh ────────────────────────────────────────────────────────────

export function listenForTokenRefresh(
  onRefresh: (newToken: string) => void,
): () => void {
  return messaging().onTokenRefresh(newToken => {
    AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
    onRefresh(newToken);
  });
}

// ─── Background handler (register in index.js) ───────────────────────────────

export function registerBackgroundHandler(): void {
  // FCM background message → display via Notifee for rich styling
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background message:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('[FCM] Opened from background:', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('[FCM] Opened from quit state:', remoteMessage);
      }
    });
}
