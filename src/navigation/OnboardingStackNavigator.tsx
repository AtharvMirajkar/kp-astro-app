import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  OnboardingScreen,
  LanguageSelectionScreen,
  BirthDetailsScreen,
} from '../screens/onboarding';

import type { OnboardingStackParamList } from './types';

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
      />
      <Stack.Screen name="BirthDetails" component={BirthDetailsScreen} />
    </Stack.Navigator>
  );
}
