/**
 * src/navigation/MainTabNavigator.tsx
 *
 * useNotifications is now called from RootNavigator (via AppNavigator),
 * NOT here. This keeps the hook at the top of the tree where it has
 * access to the root navigationRef.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

import { HomeScreen, ProfileScreen } from '../screens';
import { MatchStackNavigator } from './MatchStackNavigator';
import { HoroscopeStackNavigator } from './HoroscopeStackNavigator';
import { PredictionsStackNavigator } from './PredictionsStackNavigator';

import { colors } from '../constants/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const { t } = useTranslation();

  // ⚠️  useNotifications() has been removed from here.
  //     It is now called in AppNavigator inside RootNavigator.tsx
  //     so it receives the root navigationRef.

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-variant-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Horoscope"
        component={HoroscopeStackNavigator}
        options={{
          tabBarLabel: t('tabs.horoscope'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="zodiac-leo" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Predictions"
        component={PredictionsStackNavigator}
        options={{
          tabBarLabel: t('tabs.predictions'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="star-four-points-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Match"
        component={MatchStackNavigator}
        options={{
          tabBarLabel: t('tabs.match'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart-multiple-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
