/**
 * src/hooks/useNotifications.ts
 *
 * Handles in-app navigation when a notification is pressed.
 * Receives navigationRef from App.tsx so we always have access
 * to the root navigator regardless of which screen is active.
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
  scheduleDailyHoroscope,
} from '../services/notifeeService';

import notifee, { EventType } from '@notifee/react-native';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

// ─── Screen map ───────────────────────────────────────────────────────────────
// The `screen` value in your notification payload (data.screen) must match
// one of these keys exactly. Add new screens here as the app grows.

type ScreenMapping = {
  tab: string;
  screen: string;
};

const SCREEN_MAP: Record<string, ScreenMapping> = {
  // Horoscope stack
  DailyHoroscopeScreen: { tab: 'Horoscope', screen: 'DailyHoroscope' },
  KundaliOverview: { tab: 'HoroscopeTab', screen: 'KundaliOverview' },

  // Predictions stack
  FuturePredictions: { tab: 'Predictions', screen: 'FuturePredictions' },
  CareerPrediction: { tab: 'Predictions', screen: 'CareerPrediction' },
  MarriagePrediction: { tab: 'Predictions', screen: 'MarriagePrediction' },
  FinancePrediction: { tab: 'Predictions', screen: 'FinancePrediction' },
  HealthPrediction: { tab: 'Predictions', screen: 'HealthPrediction' },

  // Match stack
  Matching: { tab: 'Match', screen: 'Matching' },
  CompatibilityReport: { tab: 'Match', screen: 'CompatibilityReport' },

  // Single-screen tabs
  Home: { tab: 'Home', screen: 'Home' },
  Profile: { tab: 'Profile', screen: 'Profile' },
};

// ─── Navigation helper ────────────────────────────────────────────────────────

export function navigateFromNotification(
  screen: string,
  navigationRef: NavigationContainerRef<RootStackParamList>,
) {
  console.log(`[Navigate] Attempting navigation to screen: "${screen}"`);

  if (!navigationRef.isReady()) {
    console.warn('[Navigate] Navigator NOT ready, skipping');
    return;
  }

  const mapping = SCREEN_MAP[screen];
  if (!mapping) {
    console.warn(`[Navigate] UNKNOWN screen in SCREEN_MAP: "${screen}"`);
    console.log('[Navigate] Available keys:', Object.keys(SCREEN_MAP));
    return;
  }

  console.log(`[Navigate] Found mapping:`, mapping);

  try {
    navigationRef.navigate('MainTabs' as any, {
      screen: mapping.tab,
      params: { screen: mapping.screen },
    });
    console.log(
      `[Navigate] SUCCESS - Navigated to ${mapping.tab} → ${mapping.screen}`,
    );
  } catch (error) {
    console.error('[Navigate] Navigation failed with error:', error);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(
  navigationRef: NavigationContainerRef<RootStackParamList>,
) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let unsubForeground: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;
    let unsubNotifee: (() => void) | undefined;

    const init = async () => {
      await createNotificationChannels();

      const fcmGranted = await requestNotificationPermission();
      if (!fcmGranted) {
        console.warn('[Notifications] FCM permission denied');
        return;
      }

      await requestNotifeePermission();

      const token = await initFCMToken();
      if (token) {
        dispatch(updateFCMToken(token));
      }

      unsubForeground = listenForForegroundMessages();

      unsubTokenRefresh = listenForTokenRefresh(newToken => {
        dispatch(updateFCMToken(newToken));
      });

      // Foreground: app open, user taps notification banner
      unsubNotifee = notifee.onForegroundEvent(event => {
        if (event.type === EventType.PRESS) {
          const screen = event.detail.notification?.data?.screen as
            | string
            | undefined;
          if (screen) {
            navigateFromNotification(screen, navigationRef);
          }
        }
      });

      if (token) {
        await scheduleDailyHoroscope(
          '🌟 Your Daily Horoscope',
          'Tap to see what the stars have in store for you today.',
          7,
          0,
        );
      }
    };

    init();

    return () => {
      unsubForeground?.();
      unsubTokenRefresh?.();
      unsubNotifee?.();
    };
  }, [dispatch, navigationRef]);
}
