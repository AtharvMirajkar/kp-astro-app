import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import type { CreateAccountScreenProps } from '../../types/navigation';

export function CreateAccountScreen({ navigation }: CreateAccountScreenProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateAccount = () => {
    // TODO: integrate API later
  };

  const handleSignIn = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{t('appName')}</Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Logo */}

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="star-and-crescent" size={40} color={colors.primary} />
            </View>
          </View>

          {/* Title */}

          <Text style={styles.title}>{t('signup.title')}</Text>

          <Text style={styles.subtitle}>{t('signup.subtitle')}</Text>

          {/* Form */}

          <View style={styles.form}>
            <Input
              label={t('signup.fullName')}
              placeholder={t('signup.fullNamePlaceholder')}
              value={fullName}
              onChangeText={setFullName}
              leftIcon="user"
              autoCapitalize="words"
            />

            <Input
              label={t('signup.email')}
              placeholder={t('signup.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              leftIcon="email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label={t('signup.password')}
              placeholder={t('signup.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              leftIcon="password"
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(prev => !prev)}
            />

            <Input
              label={t('signup.confirmPassword')}
              placeholder={t('signup.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon="password"
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowConfirmPassword(prev => !prev)}
            />

            <PrimaryButton
              title={t('signup.createAccount')}
              onPress={handleCreateAccount}
            />

            {/* Login redirect */}

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>{t('signup.haveAccount')}</Text>

              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.loginLink}>{t('signup.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>{t('footer.terms')}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    minHeight: 44,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  headerSpacer: {
    width: 32,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.logoBackground,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },

  form: {
    marginBottom: 24,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginPrompt: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.link,
    marginLeft: 4,
  },

  footerText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
