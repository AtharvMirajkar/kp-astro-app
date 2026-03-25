import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { OnboardingStackNavigator } from './OnboardingStackNavigator';
import type { RootStackParamList } from './types';
import { AppDispatch } from '../redux/store';
import {
  setBirthDetails,
  setCurrentKundali, // add this action — see kundaliSlice changes below
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
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkPersistedData = async () => {
      try {
        const [storedBirth, storedKundali] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BIRTH_DETAILS),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KUNDALI),
        ]);

        if (storedBirth) {
          // Rehydrate Redux with persisted birth details
          dispatch(setBirthDetails(JSON.parse(storedBirth)));
        }

        if (storedKundali) {
          // Rehydrate Redux with persisted kundali data
          dispatch(setCurrentKundali(JSON.parse(storedKundali)));
        }

        // If birth details exist → user has already onboarded → go to MainTabs
        setInitialRoute(storedBirth ? 'MainTabs' : 'Onboarding');
      } catch (error) {
        console.error('[RootNavigator] Failed to load persisted data:', error);
        setInitialRoute('Onboarding');
      }
    };

    checkPersistedData();
  }, [dispatch]);

  // Show a splash/loader while checking AsyncStorage
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
