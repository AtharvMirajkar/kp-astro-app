import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
export type MatchStackParamList = {
  Matching: undefined;
  CompatibilityReport: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Match: NavigatorScreenParams<MatchStackParamList>;
  Horoscope: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;

export type HoroscopeScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Horoscope'
>;

export type ProfileScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Profile'
>;

export type SettingsScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Settings'
>;

export type MatchingScreenProps = StackScreenProps<
  MatchStackParamList,
  'Matching'
>;

export type CompatibilityReportScreenProps = StackScreenProps<
  MatchStackParamList,
  'CompatibilityReport'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}
