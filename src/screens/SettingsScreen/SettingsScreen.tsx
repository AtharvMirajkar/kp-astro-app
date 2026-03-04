import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { OptionSelectModal } from '../../components';
import { colors } from '../../constants/colors';
import type { SettingsScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';

const SUPPORTED_LOCALES = ['en', 'hi', 'mr'] as const;
type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

function normalizeLanguage(lang: string): LocaleCode {
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('mr')) return 'mr';
  return 'en';
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [nodeCalculationOn, setNodeCalculationOn] = useState(true);
  const [pushNotificationsOn, setPushNotificationsOn] = useState(false);

  const currentLang = normalizeLanguage(i18n.language);
  const currentLanguageLabel =
    currentLang === 'en'
      ? t('settings.languageEn')
      : currentLang === 'hi'
      ? t('settings.languageHi')
      : t('settings.languageMr');

  const languageOptions = useMemo(
    () => [
      { value: 'en', label: t('languageModal.optionEn') },
      { value: 'hi', label: t('languageModal.optionHi') },
      { value: 'mr', label: t('languageModal.optionMr') },
    ],
    [t],
  );

  const handleLanguageApply = (value: string) => {
    const locale = normalizeLanguage(value);
    if (SUPPORTED_LOCALES.includes(locale as LocaleCode)) {
      i18n.changeLanguage(locale);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          {navigation.canGoBack() ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.headerIconButton}
            >
              <Icon name="arrow-left" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerIconButton} />
          )}
          <Text style={styles.headerTitle}>{t('settings.screenTitle')}</Text>
          <View style={styles.headerIconButton} />
        </View>

        <View style={styles.profileBlock}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80x80.png' }}
              style={styles.avatarImage}
            />
            <View style={styles.editAvatarBadge}>
              <Icon name="pencil" size={14} color={colors.textOnPrimary} />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{t('settings.userName')}</Text>
              <Icon name="check-decagram" size={20} color={colors.primary} />
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>
                {t('settings.premiumBadge')}
              </Text>
            </View>
            <Text style={styles.userId}>{t('settings.userId')}</Text>
          </View>
          <TouchableOpacity
            style={styles.manageAccountButton}
            activeOpacity={0.85}
          >
            <Text style={styles.manageAccountButtonText}>
              {t('settings.manageAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {t('settings.astrologyEngine').toUpperCase()}
        </Text>
        <View style={styles.sectionCard}>
          <Pressable
            style={styles.row}
            onPress={() => {}}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.rowIconSquare}>
              <Icon name="star-four-points" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{t('settings.ayanamsa')}</Text>
              <Text style={styles.rowSub}>{t('settings.ayanamsaValue')}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </Pressable>
          <Pressable
            style={styles.row}
            onPress={() => {}}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.rowIconSquare}>
              <Icon name="view-grid-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{t('settings.chartStyle')}</Text>
              <Text style={styles.rowSub}>{t('settings.chartStyleValue')}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </Pressable>
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
              <Icon name="circle-outline" size={20} color={colors.textMuted} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>
                {t('settings:nodeCalculation')}
              </Text>
              <Text style={styles.rowSub}>
                {t('settings.nodeCalculationValue')}
              </Text>
            </View>
            <Switch
              value={nodeCalculationOn}
              onValueChange={setNodeCalculationOn}
              trackColor={{
                false: colors.border,
                true: colors.logoBackground,
              }}
              thumbColor={nodeCalculationOn ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('settings.preferences').toUpperCase()}
        </Text>
        <View style={styles.sectionCard}>
          <Pressable
            style={styles.row}
            onPress={() => setLanguageModalVisible(true)}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.rowIconCircle}>
              <Icon name="earth" size={20} color={colors.textMuted} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{t('settings.language')}</Text>
              <Text style={styles.rowSub}>{currentLanguageLabel}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </Pressable>
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
              <Icon name="bell-outline" size={20} color={colors.textMuted} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>
                {t('settings.pushNotifications')}
              </Text>
              <Text style={styles.rowSub}>
                {t('settings.pushNotificationsValue')}
              </Text>
            </View>
            <Switch
              value={pushNotificationsOn}
              onValueChange={setPushNotificationsOn}
              trackColor={{
                false: colors.border,
                true: colors.logoBackground,
              }}
              thumbColor={
                pushNotificationsOn ? colors.primary : colors.textMuted
              }
            />
          </View>
          <Pressable
            style={styles.row}
            onPress={() => {}}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.rowIconCircle}>
              <Icon
                name="theme-light-dark"
                size={20}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{t('settings.appearance')}</Text>
              <Text style={styles.rowSub}>{t('settings.appearanceValue')}</Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      <OptionSelectModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title={t('languageModal.title')}
        options={languageOptions}
        selectedValue={currentLang}
        onApply={handleLanguageApply}
        applyButtonText={t('languageModal.applySelection')}
        disclaimerText={t('languageModal.disclaimer')}
        titleIcon="star-four-points"
        activeSubLabel={t('languageModal.currentlyActive')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  headerIconButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  profileBlock: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.border,
  },
  editAvatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  userName: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textOnPrimary,
  },
  userId: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  manageAccountButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  manageAccountButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textOnPrimary,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowIconSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  rowSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
});
