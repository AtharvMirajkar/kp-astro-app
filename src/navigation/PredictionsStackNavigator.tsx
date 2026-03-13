import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FuturePredictionsScreen } from '../screens/predictions/FuturePredictionsScreen';
import type { PredictionsStackParamList } from './types';
import { CareerPredictionScreen, MarriagePredictionScreen } from '../screens/predictions';

const Stack = createStackNavigator<PredictionsStackParamList>();

export function PredictionsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="FuturePredictions"
        component={FuturePredictionsScreen}
      />
      {/* These screens will be implemented when API is ready */}
      <Stack.Screen
        name="CareerPrediction"
        component={CareerPredictionScreen}
      />
      <Stack.Screen
        name="MarriagePrediction"
        component={MarriagePredictionScreen}
      />
      {/* <Stack.Screen name="FinancePrediction"  component={FinancePredictionScreen} /> */}
      {/* <Stack.Screen name="HealthPrediction"   component={HealthPredictionScreen} /> */}
    </Stack.Navigator>
  );
}
