/**
 * src/hooks/useNotifications.ts
 *
 * Drop into MainTabNavigator (or App.tsx).
 *
 * What it does:
 *  1. Requests notification permission
 *  2. Starts foreground message listener
 *  3. Listens for token refresh → dispatches updateFCMToken to Redux
 *  4. Cleans up on unmount
 *
 * NOTE: FCM token + deviceId are registered to backend inside
 * saveBirthDetails thunk (called from BirthDetailsScreen).
 * This hook only manages the ongoing listeners.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateFCMToken } from '../redux/slices/kundaliSlice';
import {
  requestNotificationPermission,
  listenForForegroundMessages,
  listenForTokenRefresh,
} from '../services/notificationService';

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let unsubForeground: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;

    const init = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.warn('[Notifications] Permission not granted');
        return;
      }

      // Listen for messages while app is in foreground
      unsubForeground = listenForForegroundMessages();

      // When FCM rotates the token, update Redux so it's available
      // for the next API call or re-registration
      unsubTokenRefresh = listenForTokenRefresh(newToken => {
        dispatch(updateFCMToken(newToken));
      });
    };

    init();

    return () => {
      unsubForeground?.();
      unsubTokenRefresh?.();
    };
  }, [dispatch]);
}
