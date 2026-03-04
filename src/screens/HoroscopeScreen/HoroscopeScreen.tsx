import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { Input, PrimaryButton } from '../../components';
import type { HoroscopeScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';

export function HoroscopeScreen({ navigation }: HoroscopeScreenProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  const handleGenerateChart = () => {
    navigation.navigate('KundaliOverview', {
      name: fullName || undefined,
      dob: dateOfBirth || undefined,
      tob: timeOfBirth || undefined,
      place: placeOfBirth || undefined,
    });
  };

  const handleUseCurrentLocation = () => {
    // Placeholder: hook into location permission + reverse geocoding
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('kundali.screenTitle')}</Text>
          <TouchableOpacity
            onPress={() => {}}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon
              name="information-outline"
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionIntro}>
          <Text style={styles.sectionTitle}>
            {t('kundali.birthDetailsTitle')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t('kundali.birthDetailsSubtitle')}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Input
            label={t('kundali.fullNameLabel')}
            placeholder={t('kundali.fullNamePlaceholder')}
            value={fullName}
            onChangeText={setFullName}
            leftIcon="user"
          />

          <View style={styles.inlineRow}>
            <TouchableOpacity style={styles.fieldPill} activeOpacity={0.8}>
              <View style={styles.fieldIconWrapper}>
                <Icon
                  name="calendar-blank-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.fieldTextWrapper}>
                <Text style={styles.fieldLabelText}>
                  {t('kundali.dobLabel')}
                </Text>
                <Text
                  style={
                    dateOfBirth
                      ? styles.fieldValueText
                      : styles.fieldPlaceholderText
                  }
                >
                  {dateOfBirth || t('kundali.dobPlaceholder')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fieldPill} activeOpacity={0.8}>
              <View style={styles.fieldIconWrapper}>
                <Icon
                  name="clock-time-four-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.fieldTextWrapper}>
                <Text style={styles.fieldLabelText}>
                  {t('kundali.tobLabel')}
                </Text>
                <Text
                  style={
                    timeOfBirth
                      ? styles.fieldValueText
                      : styles.fieldPlaceholderText
                  }
                >
                  {timeOfBirth || t('kundali.tobPlaceholder')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Input
            label={t('kundali.placeLabel')}
            placeholder={t('kundali.placePlaceholder')}
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
            leftIcon="location"
          />

          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            activeOpacity={0.8}
          >
            <View style={styles.locationRow}>
              <Icon name="crosshairs-gps" size={16} color={colors.link} />
              <Text style={styles.locationText}>
                {t('kundali.useCurrentLocation')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.ayanamsaCard}>
          <View style={styles.ayanamsaLeft}>
            <View style={styles.ayanamsaIconWrapper}>
              <Icon name="cog-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.ayanamsaLabel}>
                {t('kundali.ayanamsaLabel')}
              </Text>
              <Text style={styles.ayanamsaValue}>
                {t('kundali.ayanamsaValue')}
              </Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.ayanamsaChange}>
              {t('kundali.ayanamsaChange')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ctaWrapper}>
          <PrimaryButton
            title={t('kundali.cta')}
            onPress={handleGenerateChart}
          />
          <Text style={styles.footerNote}>{t('kundali.footerNote')}</Text>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  sectionIntro: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 6,
    fontFamily: fonts.bold,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  formCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  fieldPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fieldIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fieldTextWrapper: {
    flex: 1,
  },
  fieldLabelText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
    fontFamily: fonts.regular,
  },
  fieldPlaceholderText: {
    fontSize: 13,
    color: colors.placeholder,
    fontFamily: fonts.regular,
  },
  fieldValueText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
    color: colors.link,
    fontFamily: fonts.medium,
  },
  ayanamsaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  ayanamsaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ayanamsaIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ayanamsaLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  ayanamsaValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  ayanamsaChange: {
    fontSize: 13,
    color: colors.link,
    textTransform: 'uppercase',
    fontFamily: fonts.medium,
  },
  ctaWrapper: {
    marginTop: 8,
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
});
