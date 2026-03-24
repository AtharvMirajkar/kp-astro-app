/**
 * src/hooks/useNotifications.ts
 *
 * Drop into MainTabNavigator.
 * Now also initialises Notifee channels, permissions, and event listeners.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateFCMToken } from '../redux/slices/kundaliSlice';

import {
  requestNotificationPermission,
  initFCMToken,
  listenForForegroundMessages,
  listenForTokenRefresh,
} from '../services/notificationService';

import {
  createNotificationChannels,
  requestNotifeePermission,
  handleNotifeeEvent,
  scheduleDailyHoroscope,
} from '../services/notifeeService';

import notifee, { EventType } from '@notifee/react-native';

export function useNotifications(navigate?: (screen: string) => void) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let unsubForeground: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;
    let unsubNotifee: (() => void) | undefined;

    const init = async () => {
      // 1. Create Android notification channels (idempotent, safe to repeat)
      await createNotificationChannels();

      // 2. Request FCM permission
      const fcmGranted = await requestNotificationPermission();
      if (!fcmGranted) {
        console.warn('[Notifications] FCM permission denied');
        return;
      }

      // 3. Request Notifee permission (needed on iOS)
      await requestNotifeePermission();

      // 4. Get current FCM token and sync to backend via PATCH /api/users/fcm-token
      //    Handles both first launch and cases where token changed since last session
      const token = await initFCMToken();
      if (token) {
        dispatch(updateFCMToken(token));
      }

      // 5. Foreground FCM listener → Notifee display
      unsubForeground = listenForForegroundMessages();

      // 6. Token refresh → sync new token to backend + update Redux
      unsubTokenRefresh = listenForTokenRefresh(newToken => {
        dispatch(updateFCMToken(newToken));
      });

      // 7. Notifee foreground event listener (notification press → navigate)
      unsubNotifee = notifee.onForegroundEvent(event => {
        if (event.type === EventType.PRESS) {
          handleNotifeeEvent(event, screen => {
            navigate?.(screen);
          });
        }
      });

      // 8. Schedule daily horoscope local trigger at 7:00 AM
      if (token) {
        await scheduleDailyHoroscope(
          '🌟 Your Daily Horoscope',
          'Tap to see what the stars have in store for you today.',
          7, // hour (IST)
          0, // minute
        );
      }
    };

    init();

    return () => {
      unsubForeground?.();
      unsubTokenRefresh?.();
      unsubNotifee?.();
    };
  }, [dispatch, navigate]);
}
