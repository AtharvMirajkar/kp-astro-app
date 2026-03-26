import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

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

// ─── AsyncStorage keys ────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  BIRTH_DETAILS: '@kp_birth_details',
  CURRENT_KUNDALI: '@kp_current_kundali',
} as const;

// ─── Navigator ────────────────────────────────────────────────────────────────

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();

  // Show splash first, then resolve route
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  // ── Load persisted data while splash is showing ─────────────────────────
  useEffect(() => {
    const checkPersistedData = async () => {
      try {
        const [storedBirth, storedKundali] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BIRTH_DETAILS),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KUNDALI),
        ]);

        if (storedBirth) {
          dispatch(setBirthDetails(JSON.parse(storedBirth)));
        }
        if (storedKundali) {
          dispatch(setCurrentKundali(JSON.parse(storedKundali)));
        }

        setInitialRoute(storedBirth ? 'MainTabs' : 'Onboarding');
      } catch (error) {
        console.error('[RootNavigator] Failed to load persisted data:', error);
        setInitialRoute('Onboarding');
      }
    };

    checkPersistedData();
  }, [dispatch]);

  // ── Show splash until animation finishes ─────────────────────────────────
  // Data loading happens in parallel so by the time splash (2.8s) is done,
  // initialRoute is always resolved.
  if (!isSplashDone) {
    return <SplashScreen onFinish={() => setIsSplashDone(true)} />;
  }

  // ── Tiny safety net: if data check somehow isn't done yet ────────────────
  if (!initialRoute) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingStackNavigator} />
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
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
