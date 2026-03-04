import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type MainTabParamList = {
  Home: undefined;
  Match: undefined;
  Horoscope: undefined;
  Profile: undefined;
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

export type MatchingScreenProps = BottomTabScreenProps<
  MainTabParamList,
  'Match'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}
