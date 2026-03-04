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
import type { MatchingScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';

type Gender = 'male' | 'female';

function PartnerForm({
  titleKey,
  fullNamePlaceholderKey,
  gender,
  onGenderChange,
  fullName,
  onFullNameChange,
  dob,
  onDobChange,
  tob,
  onTobChange,
  location,
  onLocationChange,
  t,
}: {
  titleKey: string;
  fullNamePlaceholderKey: string;
  gender: Gender;
  onGenderChange: (g: Gender) => void;
  fullName: string;
  onFullNameChange: (s: string) => void;
  dob: string;
  onDobChange: (s: string) => void;
  tob: string;
  onTobChange: (s: string) => void;
  location: string;
  onLocationChange: (s: string) => void;
  t: (key: string) => string;
}) {
  return (
    <View style={styles.partnerCard}>
      <View style={styles.partnerHeader}>
        <Icon name="account-outline" size={18} color={colors.primary} />
        <Text style={styles.partnerTitle}>{t(titleKey)}</Text>
      </View>
      <Input
        label={t('matching.fullNameLabel')}
        placeholder={t(fullNamePlaceholderKey)}
        value={fullName}
        onChangeText={onFullNameChange}
        leftIcon="user"
      />
      <Text style={styles.fieldLabel}>{t('matching.genderLabel')}</Text>
      <TouchableOpacity
        style={styles.genderRow}
        activeOpacity={0.8}
        onPress={() => onGenderChange(gender === 'male' ? 'female' : 'male')}
      >
        <Text style={styles.genderValue}>
          {gender === 'male'
            ? t('matching.genderMale')
            : t('matching.genderFemale')}
        </Text>
        <Icon name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <View style={styles.inlineRow}>
        <TouchableOpacity style={styles.fieldPill} activeOpacity={0.8}>
          <View style={styles.fieldTextWrapper}>
            <Text style={styles.fieldLabelText}>{t('matching.dobLabel')}</Text>
            <Text
              style={dob ? styles.fieldValueText : styles.fieldPlaceholderText}
            >
              {dob || t('matching.dobPlaceholder')}
            </Text>
          </View>
          <Icon
            name="calendar-blank-outline"
            size={18}
            color={colors.primary}
            style={styles.fieldRightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fieldPill} activeOpacity={0.8}>
          <View style={styles.fieldTextWrapper}>
            <Text style={styles.fieldLabelText}>{t('matching.tobLabel')}</Text>
            <Text
              style={tob ? styles.fieldValueText : styles.fieldPlaceholderText}
            >
              {tob || t('matching.tobPlaceholder')}
            </Text>
          </View>
          <Icon
            name="clock-time-four-outline"
            size={18}
            color={colors.primary}
            style={styles.fieldRightIcon}
          />
        </TouchableOpacity>
      </View>
      <Input
        label={t('matching.birthLocationLabel')}
        placeholder={t('matching.birthLocationPlaceholder')}
        value={location}
        onChangeText={onLocationChange}
        leftIcon="location"
      />
    </View>
  );
}

export function MatchingScreen({ navigation }: MatchingScreenProps) {
  const { t } = useTranslation();
  const [gender1, setGender1] = useState<Gender>('male');
  const [gender2, setGender2] = useState<Gender>('female');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [tob1, setTob1] = useState('');
  const [tob2, setTob2] = useState('');
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');

  const handleCalculate = () => {
    navigation.navigate('CompatibilityReport');
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
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('matching.screenTitle')}</Text>
          <TouchableOpacity
            onPress={() => {}}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="information-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotInactive]} />
        </View>

        <View style={styles.sectionIntro}>
          <Text style={styles.sectionTitle}>{t('matching.checkTitle')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('matching.checkSubtitle')}
          </Text>
        </View>

        <PartnerForm
          titleKey="matching.firstPartner"
          fullNamePlaceholderKey="matching.fullNamePlaceholder1"
          gender={gender1}
          onGenderChange={setGender1}
          fullName={name1}
          onFullNameChange={setName1}
          dob={dob1}
          onDobChange={setDob1}
          tob={tob1}
          onTobChange={setTob1}
          location={location1}
          onLocationChange={setLocation1}
          t={t}
        />

        <View style={styles.heartSeparator}>
          <View style={styles.heartCircle}>
            <Icon name="heart" size={28} color={colors.textOnPrimary} />
          </View>
        </View>

        <PartnerForm
          titleKey="matching.secondPartner"
          fullNamePlaceholderKey="matching.fullNamePlaceholder2"
          gender={gender2}
          onGenderChange={setGender2}
          fullName={name2}
          onFullNameChange={setName2}
          dob={dob2}
          onDobChange={setDob2}
          tob={tob2}
          onTobChange={setTob2}
          location={location2}
          onLocationChange={setLocation2}
          t={t}
        />

        <View style={styles.ctaWrapper}>
          <PrimaryButton title={t('matching.cta')} onPress={handleCalculate} />
          <Text style={styles.footerNote}>{t('matching.footerNote')}</Text>
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  progressDotInactive: {
    backgroundColor: colors.border,
  },
  sectionIntro: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    lineHeight: 20,
  },
  partnerCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  partnerTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  genderValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fieldPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fieldTextWrapper: {
    flex: 1,
  },
  fieldLabelText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 2,
  },
  fieldPlaceholderText: {
    fontSize: 13,
    color: colors.placeholder,
  },
  fieldValueText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  fieldRightIcon: {
    marginLeft: 8,
  },
  heartSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  heartCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaWrapper: {
    marginTop: 8,
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
