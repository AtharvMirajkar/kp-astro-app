/**
 * src/services/notifeeService.ts
 *
 * Background press navigation works by storing the navigationRef
 * at module scope via setNavigationRef(), called from App.tsx once
 * the NavigationContainer is mounted. No deep linking needed.
 */

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidStyle,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { navigateFromNotification } from '../hooks/useNotifications';

// ─── Module-level navigationRef ───────────────────────────────────────────────
// Set once from App.tsx after NavigationContainer mounts.

let _navigationRef: NavigationContainerRef<RootStackParamList> | null = null;

export function setNavigationRef(
  ref: NavigationContainerRef<RootStackParamList>,
) {
  _navigationRef = ref;
}

export { _navigationRef };
// ─── Channel IDs ──────────────────────────────────────────────────────────────

export const CHANNELS = {
  DEFAULT: 'kp_default',
  HOROSCOPE: 'kp_horoscope',
  DASHA: 'kp_dasha',
  AUSPICIOUS: 'kp_auspicious',
} as const;

export type ChannelId = (typeof CHANNELS)[keyof typeof CHANNELS];

// ─── 1. Create Android channels ───────────────────────────────────────────────

export async function createNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await notifee.createChannels([
    {
      id: CHANNELS.DEFAULT,
      name: 'General',
      importance: AndroidImportance.DEFAULT,
      visibility: AndroidVisibility.PUBLIC,
    },
    {
      id: CHANNELS.HOROSCOPE,
      name: 'Daily Horoscope',
      description: 'Your daily horoscope and cosmic forecast',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
      vibration: true,
    },
    {
      id: CHANNELS.DASHA,
      name: 'Dasha Period',
      description: 'Notifications about your Dasha period changes',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
      vibration: true,
    },
    {
      id: CHANNELS.AUSPICIOUS,
      name: 'Auspicious Dates',
      description: 'Alerts for auspicious and important dates',
      importance: AndroidImportance.DEFAULT,
      visibility: AndroidVisibility.PUBLIC,
    },
  ]);

  console.log('[Notifee] Android channels created');
}

// ─── 2. Map notification type → channel ──────────────────────────────────────

function getChannelForType(type?: string): ChannelId {
  switch (type) {
    case 'dailyHoroscope':
      return CHANNELS.HOROSCOPE;
    case 'dashaPeriodChange':
      return CHANNELS.DASHA;
    case 'auspiciousDates':
      return CHANNELS.AUSPICIOUS;
    default:
      return CHANNELS.DEFAULT;
  }
}

// ─── 3. Display a styled notification ─────────────────────────────────────────

export async function displayNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  const title = (remoteMessage.data?.title as string) ?? 'KP Jyotish';
  const body = (remoteMessage.data?.body as string) ?? '';
  const type = (remoteMessage.data?.type as string) ?? 'general';
  const screen = (remoteMessage.data?.screen as string) ?? '';

  await notifee.displayNotification({
    title,
    body,
    data: { type, screen },
    android: {
      channelId: getChannelForType(type),
      smallIcon: 'ic_notification',
      color: '#C9A227',
      pressAction: { id: 'default' },
      importance: AndroidImportance.HIGH,
      style: { type: AndroidStyle.BIGTEXT, text: body },
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: { alert: true, badge: true, sound: true },
    },
  });
}

// ─── 4. Request Notifee permission (iOS) ──────────────────────────────────────

export async function requestNotifeePermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

// ─── 6. Schedule daily horoscope ──────────────────────────────────────────────

export async function scheduleDailyHoroscope(
  title: string,
  body: string,
  hourIST: number = 7,
  minuteIST: number = 0,
): Promise<void> {
  await cancelScheduledNotification('daily_horoscope_trigger');

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hourIST, minuteIST, 0, 0);
  if (trigger <= now) trigger.setDate(trigger.getDate() + 1);

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id: 'daily_horoscope_trigger',
      title,
      body,
      data: { type: 'dailyHoroscope', screen: 'DailyHoroscopeScreen' },
      android: {
        channelId: CHANNELS.HOROSCOPE,
        smallIcon: 'ic_notification',
        color: '#C9A227',
        pressAction: { id: 'default' },
      },
      ios: { sound: 'default' },
    },
    timestampTrigger,
  );

  console.log(
    `[Notifee] Daily horoscope scheduled at ${hourIST}:${String(
      minuteIST,
    ).padStart(2, '0')}`,
  );
}

// ─── 7. Cancel helpers ────────────────────────────────────────────────────────

export async function cancelScheduledNotification(id: string): Promise<void> {
  await notifee.cancelTriggerNotification(id);
}

export async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}
