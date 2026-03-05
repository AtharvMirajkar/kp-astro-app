import React, { useMemo, useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

const SUPPORTED_LOCALES = ['en', 'hi', 'mr'] as const;
type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

function normalizeLanguage(lang: string): LocaleCode {
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('mr')) return 'mr';
  return 'en';
}

export function LanguageSelectionScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();

  const currentLang = normalizeLanguage(i18n.language);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LocaleCode>(currentLang);

  const languageOptions = useMemo(
    () => [
      { code: 'en', label: t('languageModal.optionEn') },
      { code: 'hi', label: t('languageModal.optionHi') },
      { code: 'mr', label: t('languageModal.optionMr') },
    ],
    [t],
  );

  const handleContinue = () => {
    if (SUPPORTED_LOCALES.includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }

    navigation.navigate('BirthDetails');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('appName')}</Text>
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="translate" size={40} color={colors.primary} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('languageModal.title')}</Text>
          <Text style={styles.subtitle}>{t('languageModal.disclaimer')}</Text>

          {/* Language List */}
          <View style={styles.languageContainer}>
            {languageOptions.map(lang => {
              const isSelected = selectedLanguage === lang.code;

              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    isSelected && styles.selectedLanguage,
                  ]}
                  onPress={() => setSelectedLanguage(lang.code as LocaleCode)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      isSelected && styles.selectedLanguageText,
                    ]}
                  >
                    {lang.label}
                  </Text>

                  {isSelected && (
                    <Icon
                      name="check-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <PrimaryButton
            title={t('languageModal.applySelection')}
            onPress={handleContinue}
          />

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
    alignItems: 'center',
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  iconCircle: {
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
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },

  languageContainer: {
    marginBottom: 30,
  },

  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  selectedLanguage: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5F0',
  },

  languageText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },

  selectedLanguageText: {
    color: colors.primary,
  },

  footerText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
