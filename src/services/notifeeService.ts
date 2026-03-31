/**
 * src/services/notifeeService.ts
 *
 * Wraps Notifee for styled push notifications.
 *
 * Responsibilities:
 *  1. Create Android notification channels (called once on app launch)
 *  2. Display a styled local notification from any FCM RemoteMessage
 *  3. Handle notification press events (foreground + background)
 *  4. Schedule trigger notifications (daily horoscope, reminders)
 *
 * Install:
 *   npm install @notifee/react-native
 *   cd ios && pod install
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
  Event,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// ─── Channel IDs ──────────────────────────────────────────────────────────────

export const CHANNELS = {
  DEFAULT: 'kp_default',
  HOROSCOPE: 'kp_horoscope',
  DASHA: 'kp_dasha',
  AUSPICIOUS: 'kp_auspicious',
} as const;

export type ChannelId = (typeof CHANNELS)[keyof typeof CHANNELS];

// ─── 1. Create Android channels ───────────────────────────────────────────────
// Call this ONCE in App.tsx on mount — safe to call multiple times (idempotent)

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

// ─── 2. Map FCM notification type → channel ───────────────────────────────────

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

// ─── 3. Display a styled notification from an FCM RemoteMessage ───────────────
// Replace the plain Alert() in your foreground listener with this.
// Also call this from the background handler for rich display.

export async function displayNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  // Backend sends DATA-ONLY messages — title and body are in remoteMessage.data.
  // remoteMessage.notification will be undefined — that is expected and correct.
  const title = (remoteMessage.data?.title as string) ?? 'KP Jyotish';
  const body = (remoteMessage.data?.body as string) ?? '';
  const type = (remoteMessage.data?.type as string) ?? 'general';
  const screen = (remoteMessage.data?.screen as string) ?? '';

  const channelId = getChannelForType(type);

  await notifee.displayNotification({
    title,
    body,
    data: { type, screen },
    android: {
      channelId,
      smallIcon: 'ic_notification',
      color: '#C9A227',
      pressAction: { id: 'default' },
      importance: AndroidImportance.HIGH,
      style: {
        type: AndroidStyle.BIGTEXT,
        text: body,
      },
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
}

// ─── 4. Request Notifee permission (iOS) ─────────────────────────────────────
// On Android, channels handle permission. On iOS call this on first launch.

export async function requestNotifeePermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

// ─── 5. Notification press event handler ─────────────────────────────────────
// Pass a navigation ref to handle screen routing on notification tap.
// Register this in your App.tsx via notifee.onForegroundEvent().

export function handleNotifeeEvent(
  event: Event,
  navigate: (screen: string) => void,
): void {
  const { type, detail } = event;

  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    const screen = detail.notification?.data?.screen as string | undefined;
    if (screen) {
      navigate(screen);
    }
  }
}

// ─── 6. Background event handler ─────────────────────────────────────────────
// Register in index.js — outside the component tree.

export function registerNotifeeBackgroundHandler(): void {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('[Notifee] Background press:', detail.notification?.data);
      // Navigation is handled when the app opens via getForegroundEvent
    }
    if (type === EventType.DISMISSED) {
      console.log('[Notifee] Notification dismissed');
    }
  });
}

// ─── 7. Schedule a daily horoscope trigger notification ──────────────────────
// Schedules a repeating daily notification at the given hour/minute (IST).
// Call this after permissions are granted.

export async function scheduleDailyHoroscope(
  title: string,
  body: string,
  hourIST: number = 7,
  minuteIST: number = 0,
): Promise<void> {
  // Cancel any existing horoscope trigger first
  await cancelScheduledNotification('daily_horoscope_trigger');

  // Build next occurrence of the target time
  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hourIST, minuteIST, 0, 0);

  // If today's time already passed, schedule for tomorrow
  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1);
  }

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
      data: { type: 'dailyHoroscope', screen: 'FuturePredictions' },
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

// ─── 8. Cancel a scheduled notification ──────────────────────────────────────

export async function cancelScheduledNotification(id: string): Promise<void> {
  await notifee.cancelTriggerNotification(id);
}

// ─── 9. Cancel all notifications ─────────────────────────────────────────────

export async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}
