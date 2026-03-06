import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
export type MatchStackParamList = {
  Matching: undefined;
  CompatibilityReport: undefined;
};

export type HoroscopeStackParamList = {
  CreateKundali: undefined;
  KundaliOverview:
    | {
        name?: string;
        dob?: string;
        tob?: string;
        place?: string;
      }
    | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Match: NavigatorScreenParams<MatchStackParamList>;
  Horoscope: NavigatorScreenParams<HoroscopeStackParamList>;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  ForgotPassword: undefined;
  VerifyOTP: undefined;
  ResetPassword: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
  LanguageSelection: undefined;
  BirthDetails: undefined;
  KundaliLoading: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;

export type CreateAccountScreenProps = StackScreenProps<
  AuthStackParamList,
  'CreateAccount'
>;

export type ForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export type VerifyOTPScreenProps = StackScreenProps<
  AuthStackParamList,
  'VerifyOTP'
>;

export type ResetPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  'ResetPassword'
>;

export type HoroscopeScreenProps = StackScreenProps<
  HoroscopeStackParamList,
  'CreateKundali'
>;

export type KundaliOverviewScreenProps = StackScreenProps<
  HoroscopeStackParamList,
  'KundaliOverview'
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
    interface HoroscopeParamList extends HoroscopeStackParamList {}
  }
}
