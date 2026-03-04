import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HoroscopeScreen, KundaliOverviewScreen } from '../screens/HoroscopeScreen';
import type { HoroscopeStackParamList } from './types';

const Stack = createStackNavigator<HoroscopeStackParamList>();

export function HoroscopeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CreateKundali" component={HoroscopeScreen} />
      <Stack.Screen name="KundaliOverview" component={KundaliOverviewScreen} />
    </Stack.Navigator>
  );
}
