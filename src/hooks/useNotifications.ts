/**
 * src/hooks/useNotifications.ts
 *
 * Drop into MainTabNavigator.
 * Now also initialises Notifee channels, permissions, and event listeners.
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { updateFCMToken } from '../redux/slices/kundaliSlice';

import {
  requestNotificationPermission,
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

  // Read user's notification preferences from Redux if you store them
  const fcmToken = useSelector((s: RootState) => s.kundali.fcmToken);

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

      // 4. Foreground FCM listener → Notifee display (handled inside service)
      unsubForeground = listenForForegroundMessages();

      // 5. Token refresh → update Redux
      unsubTokenRefresh = listenForTokenRefresh(newToken => {
        dispatch(updateFCMToken(newToken));
      });

      // 6. Notifee foreground event listener (notification press)
      unsubNotifee = notifee.onForegroundEvent(event => {
        if (event.type === EventType.PRESS) {
          handleNotifeeEvent(event, screen => {
            navigate?.(screen);
          });
        }
      });

      // 7. Schedule daily horoscope local trigger at 7:00 AM
      //    Only schedule if user has a token (means they completed onboarding)
      if (fcmToken) {
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
  }, [dispatch, navigate, fcmToken]);
}
