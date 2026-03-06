import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Input, PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

export function BirthDetailsScreen({ navigation }: any) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [place, setPlace] = useState('');
  const [gender, setGender] = useState('');

  const handleContinue = () => {
    navigation.navigate('KundaliLoading');
  };

  const renderGenderButton = (value: string, label: string) => {
    const active = gender === value;

    return (
      <TouchableOpacity
        style={[styles.genderButton, active && styles.genderButtonActive]}
        onPress={() => setGender(value)}
      >
        <Text style={[styles.genderText, active && styles.genderTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
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
            >
              <Icon name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{t('appName')}</Text>

            <View style={{ width: 32 }} />
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="account-star" size={40} color={colors.primary} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('birthDetails.title')}</Text>

          <Text style={styles.subtitle}>{t('birthDetails.subtitle')}</Text>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('birthDetails.name')}
              placeholder={t('birthDetails.namePlaceholder')}
              value={name}
              onChangeText={setName}
              leftIcon="user"
            />

            {/* Gender */}
            <Text style={styles.genderLabel}>{t('birthDetails.gender')}</Text>

            <View style={styles.genderContainer}>
              {renderGenderButton('male', t('birthDetails.male'))}
              {renderGenderButton('female', t('birthDetails.female'))}
              {renderGenderButton('other', t('birthDetails.other'))}
            </View>

            <Input
              label={t('birthDetails.dob')}
              placeholder="DD/MM/YYYY"
              value={dob}
              onChangeText={setDob}
            />

            <Input
              label={t('birthDetails.tob')}
              placeholder="HH:MM"
              value={tob}
              onChangeText={setTob}
            />

            <Input
              label={t('birthDetails.place')}
              placeholder={t('birthDetails.placePlaceholder')}
              value={place}
              onChangeText={setPlace}
            />

            <PrimaryButton
              title={t('birthDetails.continue')}
              onPress={handleContinue}
            />
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
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },

  form: {
    marginBottom: 24,
  },

  genderLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: 10,
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },

  genderButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.logoBackground,
  },

  genderText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },

  genderTextActive: {
    color: colors.primary,
  },

  footerText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
