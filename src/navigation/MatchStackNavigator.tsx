import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MatchingScreen, CompatibilityReportScreen } from '../screens/matching';
import type { MatchStackParamList } from './types';

const Stack = createStackNavigator<MatchStackParamList>();

export function MatchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Matching" component={MatchingScreen} />
      <Stack.Screen name="CompatibilityReport" component={CompatibilityReportScreen} />
    </Stack.Navigator>
  );
}
