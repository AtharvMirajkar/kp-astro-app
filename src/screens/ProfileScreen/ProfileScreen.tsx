import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { OptionSelectModal } from '../../components';
import { colors } from '../../constants/colors';
import type { ProfileScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

const SUPPORTED_LOCALES = ['en', 'hi', 'mr'] as const;
type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

function normalizeLanguage(lang: string): LocaleCode {
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('mr')) return 'mr';
  return 'en';
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { t, i18n } = useTranslation();
  const { currentKundali, birthDetails } = useSelector(
    (state: RootState) => state.kundali,
  );

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
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

  // Dynamic kundali values
  const sunSign =
    currentKundali?.planetary_positions?.Sun?.sign ?? t('profile.sunValue');
  const moonSign =
    currentKundali?.planetary_positions?.Moon?.sign ?? t('profile.moonValue');
  const ascSign =
    currentKundali?.planetary_positions?.Ascendant?.sign ??
    t('profile.ascValue');
  const userName = birthDetails?.name ?? t('profile.name');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('profile.headerTitle')}</Text>
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x120.png' }}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.8}>
              <Icon name="pencil" size={14} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{userName}</Text>
          <View style={styles.profileMetaRow}>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>{t('profile.tierLabel')}</Text>
            </View>
            <Text style={styles.memberSinceText}>
              {t('profile.memberSince')}
            </Text>
          </View>

          {birthDetails?.dob ? (
            <Text style={styles.birthDetailText}>
              {birthDetails.dob}
              {birthDetails.tob ? `  •  ${birthDetails.tob}` : ''}
              {birthDetails.place ? `  •  ${birthDetails.place}` : ''}
            </Text>
          ) : null}

          <View style={styles.profileButtonsRow}>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
              <Icon
                name="pencil-outline"
                size={16}
                color={colors.textOnPrimary}
                style={styles.buttonIcon}
              />
              <Text style={styles.editButtonText}>
                {t('profile.editProfile')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} activeOpacity={0.85}>
              <Icon
                name="share-variant"
                size={16}
                color={colors.textPrimary}
                style={styles.buttonIcon}
              />
              <Text style={styles.shareButtonText}>
                {t('profile.shareChart')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {t('profile.savedChartsValue')}
            </Text>
            <Text style={styles.statLabel}>
              {t('profile.savedChartsLabel')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('profile.reportsValue')}</Text>
            <Text style={styles.statLabel}>{t('profile.reportsLabel')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('profile.minutesValue')}</Text>
            <Text style={styles.statLabel}>{t('profile.minutesLabel')}</Text>
          </View>
        </View>

        {/* ── Zodiac Summary ── */}
        <View style={styles.zodiacCard}>
          <Text style={styles.sectionLabel}>{t('profile.zodiacTitle')}</Text>
          <View style={styles.zodiacRow}>
            <View style={styles.zodiacItem}>
              <View style={styles.zodiacIconWrap}>
                <Icon
                  name="white-balance-sunny"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.zodiacLabel}>{t('profile.sunLabel')}</Text>
              <Text style={styles.zodiacValue}>{sunSign}</Text>
            </View>
            <View style={styles.zodiacItem}>
              <View style={styles.zodiacIconWrap}>
                <Icon
                  name="moon-waxing-crescent"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.zodiacLabel}>{t('profile.moonLabel')}</Text>
              <Text style={styles.zodiacValue}>{moonSign}</Text>
            </View>
            <View style={styles.zodiacItem}>
              <View style={styles.zodiacIconWrap}>
                <Icon name="human-male" size={18} color={colors.primary} />
              </View>
              <Text style={styles.zodiacLabel}>{t('profile.ascLabel')}</Text>
              <Text style={styles.zodiacValue}>{ascSign}</Text>
            </View>
          </View>
        </View>

        {/* ── Services ── */}
        <Text style={styles.sectionLabel}>{t('profile.servicesTitle')}</Text>

        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuRow}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.menuIconWrap}>
              <Icon
                name="file-document-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{t('profile.prashnaTitle')}</Text>
              <Text style={styles.menuSub}>{t('profile.prashnaSubtitle')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuRow}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.menuIconWrap}>
              <Icon name="wallet-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{t('profile.walletTitle')}</Text>
              <Text style={styles.menuSub}>{t('profile.walletSubtitle')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuRow}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.menuIconWrap}>
              <Icon name="history" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{t('profile.historyTitle')}</Text>
              <Text style={styles.menuSub}>{t('profile.historySubtitle')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* ── Preferences (from Settings) ── */}
        <Text style={styles.sectionLabel}>
          {t('settings.preferences').toUpperCase()}
        </Text>

        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuRow}
            onPress={() => setLanguageModalVisible(true)}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.menuIconWrap}>
              <Icon name="earth" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{t('settings.language')}</Text>
              <Text style={styles.menuSub}>{currentLanguageLabel}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.menuDivider} />

          <View style={styles.menuRow}>
            <View style={styles.menuIconWrap}>
              <Icon name="bell-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>
                {t('settings.pushNotifications')}
              </Text>
              <Text style={styles.menuSub}>
                {t('settings.pushNotificationsValue')}
              </Text>
            </View>
            <Switch
              value={pushNotificationsOn}
              onValueChange={setPushNotificationsOn}
              trackColor={{ false: colors.border, true: colors.logoBackground }}
              thumbColor={
                pushNotificationsOn ? colors.primary : colors.textMuted
              }
            />
          </View>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => {}}
            android_ripple={{ color: colors.border }}
          >
            <View style={styles.menuIconWrap}>
              <Icon name="theme-light-dark" size={18} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{t('settings.appearance')}</Text>
              <Text style={styles.menuSub}>
                {t('settings.appearanceValue')}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Header
  headerRow: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  // Profile card
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'visible',
    marginBottom: 12,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  profileName: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tierPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFE9BF',
    marginRight: 8,
  },
  tierPillText: {
    fontSize: 11,
    color: colors.primary,
    textTransform: 'uppercase',
    fontFamily: fonts.medium,
  },
  memberSinceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  birthDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 12,
    textAlign: 'center',
  },
  profileButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
    gap: 10,
  },
  buttonIcon: { marginRight: 6 },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.textOnPrimary,
    fontFamily: fonts.medium,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },

  // Zodiac
  zodiacCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  zodiacRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  zodiacItem: {
    flex: 1,
    alignItems: 'center',
  },
  zodiacIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  zodiacLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 2,
  },
  zodiacValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  // Shared section label
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.bold,
    marginBottom: 8,
    marginTop: 4,
  },

  // Menu card (services + preferences)
  menuCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  menuSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
});
