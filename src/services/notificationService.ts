/**
 * src/services/notificationService.ts
 *
 * Handles FCM token, permissions, and listeners.
 * Calls PATCH /api/users/fcm-token on app launch and whenever token rotates.
 */

import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { displayNotification } from './notifeeService';
import { updateFCMTokenOnBackend } from '../api/notificationApi';

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

// ─── Sync token to backend ────────────────────────────────────────────────────
// Calls PATCH /api/users/fcm-token with the latest token + stable deviceId.
// Called on app launch AND whenever Firebase rotates the token.

async function syncTokenToBackend(fcmToken: string): Promise<void> {
  try {
    const deviceId = await getOrCreateDeviceId();
    await updateFCMTokenOnBackend({ deviceId, fcmToken });
    console.log('[FCM] Token synced to backend');
  } catch (error) {
    // Non-blocking — token sync failure should never break the app
    console.warn('[FCM] Token sync failed:', error);
  }
}

// ─── Init token on app launch ─────────────────────────────────────────────────
// Call once from useNotifications after permission is granted.
// Gets the current FCM token and syncs it to your backend.

export async function initFCMToken(): Promise<string | null> {
  const token = await getFCMToken();
  if (token) {
    await syncTokenToBackend(token);
  }
  return token;
}

// ─── Foreground listener ──────────────────────────────────────────────────────

export function listenForForegroundMessages(
  onMessage?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(async remoteMessage => {
    console.log('[FCM] Foreground message:', remoteMessage);
    await displayNotification(remoteMessage);
    onMessage?.(remoteMessage);
  });
}

// ─── Token refresh listener ───────────────────────────────────────────────────
// Automatically syncs new token to backend and calls optional Redux callback.

export function listenForTokenRefresh(
  onRefresh: (newToken: string) => void,
): () => void {
  return messaging().onTokenRefresh(async newToken => {
    console.log('[FCM] Token refreshed');

    // 1. Persist new token locally
    await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);

    // 2. Sync to backend immediately — PATCH /api/users/fcm-token
    await syncTokenToBackend(newToken);

    // 3. Update Redux state
    onRefresh(newToken);
  });
}

// ─── Background handler (register in index.js) ───────────────────────────────

export function registerBackgroundHandler(): void {
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
