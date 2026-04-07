/**
 * src/navigation/RootNavigator.tsx
 *
 * Creates a navigationRef and:
 *  1. Passes it to useNotifications so foreground press works.
 *  2. Calls setNavigationRef() so background press works.
 *  3. Calls notifee.getInitialNotification() after splash to handle
 *     quit-state press (app was fully closed when user tapped notification).
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  NavigationContainerRef,
  createNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import notifee from '@notifee/react-native';

import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { OnboardingStackNavigator } from './OnboardingStackNavigator';
import { SplashScreen } from '../screens/onboarding';
import type { RootStackParamList } from './types';
import { AppDispatch } from '../redux/store';
import {
  setBirthDetails,
  setCurrentKundali,
} from '../redux/slices/kundaliSlice';
import { colors } from '../constants/colors';
import { setNavigationRef } from '../services/notifeeService';
import { navigateFromNotification } from '../hooks/useNotifications';
import { useNotifications } from '../hooks/useNotifications';

// ─── AsyncStorage keys ────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  BIRTH_DETAILS: '@kp_birth_details',
  CURRENT_KUNDALI: '@kp_current_kundali',
} as const;

const Stack = createStackNavigator<RootStackParamList>();

// ─── Inner navigator — has access to dispatch and navigationRef ───────────────

function AppNavigator({
  initialRoute,
  navigationRef,
}: {
  initialRoute: keyof RootStackParamList;
  navigationRef: NavigationContainerRef<RootStackParamList>;
}) {
  // Hook now receives navigationRef instead of useNavigation()
  useNotifications(navigationRef);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingStackNavigator} />
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────

export function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const navigationRef = useRef(
    createNavigationContainerRef<RootStackParamList>(),
  ).current;

  const [isSplashDone, setIsSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  // ── Load persisted data while splash plays ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [storedBirth, storedKundali] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BIRTH_DETAILS),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KUNDALI),
        ]);
        if (storedBirth) dispatch(setBirthDetails(JSON.parse(storedBirth)));
        if (storedKundali)
          dispatch(setCurrentKundali(JSON.parse(storedKundali)));
        setInitialRoute(storedBirth ? 'MainTabs' : 'Onboarding');
      } catch {
        setInitialRoute('Onboarding');
      }
    };
    load();
  }, [dispatch]);

  // ── Handle quit-state notification press ──────────────────────────────────
  useEffect(() => {
    if (!isSplashDone || !initialRoute) return;

    const handleQuitStateNotification = async () => {
      const initial = await notifee.getInitialNotification();
      if (!initial?.notification?.data?.screen) {
        console.log('[Notifee Quit] No initial notification');
        return;
      }

      const screen = initial.notification.data.screen as string;
      console.log('[Notifee Quit] Found screen:', screen);

      // Wait a bit for navigator to be fully ready after splash
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigateFromNotification(screen, navigationRef);
        } else {
          console.warn('[Notifee Quit] Navigator not ready even after delay');
        }
      }, 800);
    };

    handleQuitStateNotification();
  }, [isSplashDone, initialRoute, navigationRef]);

  // ── Splash ────────────────────────────────────────────────────────────────
  if (!isSplashDone) {
    return <SplashScreen onFinish={() => setIsSplashDone(true)} />;
  }

  if (!initialRoute) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Make the ref available to the background handler in notifeeService
        setNavigationRef(navigationRef);
      }}
    >
      <AppNavigator initialRoute={initialRoute} navigationRef={navigationRef} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
