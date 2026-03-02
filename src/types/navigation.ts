import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

export type MainTabParamList = {
  Home: undefined;
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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}
