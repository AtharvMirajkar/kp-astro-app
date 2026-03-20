/**
 * src/services/notificationService.ts
 *
 * Handles:
 *  - Requesting notification permissions (iOS + Android 13+)
 *  - Getting FCM token
 *  - Storing deviceId in AsyncStorage
 *  - Foreground / background / quit listeners
 *
 * NOTE: This service does NOT call the backend directly.
 * The FCM token + deviceId are passed into kundaliSlice
 * so they get saved together with birth details via POST /api/users.
 */

import { Platform, Alert } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // Android 13+ (API 33+)
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const { PermissionsAndroid } = require('react-native');
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

// ─── Stable device ID (persisted across sessions) ────────────────────────────

export async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = await DeviceInfo.getUniqueId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// ─── FCM token ────────────────────────────────────────────────────────────────

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

// ─── Get cached FCM token (no network call) ───────────────────────────────────

export async function getCachedFCMToken(): Promise<string | null> {
  return AsyncStorage.getItem(FCM_TOKEN_KEY);
}

// ─── Foreground message listener ─────────────────────────────────────────────

export function listenForForegroundMessages(
  onMessage?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(async remoteMessage => {
    const title = remoteMessage.notification?.title ?? 'KP Jyotish';
    const body = remoteMessage.notification?.body ?? '';
    if (onMessage) {
      onMessage(remoteMessage);
    } else {
      Alert.alert(title, body);
    }
  });
}

// ─── Token refresh listener ───────────────────────────────────────────────────

export function listenForTokenRefresh(
  onRefresh: (newToken: string) => void,
): () => void {
  return messaging().onTokenRefresh(newToken => {
    AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
    onRefresh(newToken);
  });
}

// ─── Background handler (must be called in index.js, outside component tree) ──

export function registerBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background message:', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('[FCM] Opened from background:', remoteMessage);
    // Handle deep link navigation via remoteMessage.data.screen if needed
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('[FCM] Opened from quit state:', remoteMessage);
      }
    });
}
