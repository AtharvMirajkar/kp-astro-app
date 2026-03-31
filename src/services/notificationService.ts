/**
 * src/services/notificationService.ts
 *
 * FCM token management, permissions, and listeners.
 * Works with DATA-ONLY FCM messages — Notifee handles all display.
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

async function syncTokenToBackend(fcmToken: string): Promise<void> {
  try {
    const deviceId = await getOrCreateDeviceId();
    await updateFCMTokenOnBackend({ deviceId, fcmToken });
    console.log('[FCM] Token synced to backend');
  } catch (error) {
    console.warn('[FCM] Token sync failed:', error);
  }
}

// ─── Init token on app launch ─────────────────────────────────────────────────

export async function initFCMToken(): Promise<string | null> {
  const token = await getFCMToken();
  if (token) {
    await syncTokenToBackend(token);
  }
  return token;
}

// ─── Foreground listener ──────────────────────────────────────────────────────
// App is open → FCM never auto-displays → Notifee must display it

export function listenForForegroundMessages(
  onMessage?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(async remoteMessage => {
    console.log('[FCM] Foreground message:', remoteMessage);
    // Always display — FCM never shows anything when app is in foreground
    await displayNotification(remoteMessage);
    onMessage?.(remoteMessage);
  });
}

// ─── Token refresh listener ───────────────────────────────────────────────────

export function listenForTokenRefresh(
  onRefresh: (newToken: string) => void,
): () => void {
  return messaging().onTokenRefresh(async newToken => {
    console.log('[FCM] Token refreshed');
    await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
    await syncTokenToBackend(newToken);
    onRefresh(newToken);
  });
}

// ─── Background / quit handler (register in index.js) ────────────────────────
//
// Backend now sends DATA-ONLY messages (no `notification` key).
// FCM never auto-displays data-only messages in any state.
// Notifee handles display in ALL states → always call displayNotification().

export function registerBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('[FCM] Background message:', remoteMessage);
    // Data-only: FCM does nothing, Notifee does everything ✅
    await displayNotification(remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('[FCM] Opened from background:', remoteMessage);
    // Navigate handled via Notifee press event in useNotifications
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('[FCM] Opened from quit state:', remoteMessage);
      }
    });
}
