import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input, PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

import { useDispatch } from 'react-redux';
import { setBirthDetails } from '../../redux/slices/kundaliSlice';
import { AppDispatch } from '../../redux/store';

export function BirthDetailsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  // ── Date & Time ────────────────────────────────────────
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [place, setPlace] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceTimeout = useRef<number | null>(null);

  // Format helpers
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatTime = (time: Date | null) => {
    if (!time) return '';
    return time.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }); // 24-hour HH:MM
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS stays open
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  const searchLocation = (text: string) => {
    setPlace(text);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (text.length < 3) {
      setLocations([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            text,
          )}&format=json&limit=5`,
          {
            headers: {
              'User-Agent': 'KundaliApp/1.0',
              'Accept-Language': 'en',
            },
          },
        );
        const data = await response.json();
        setLocations(data);
        setShowSuggestions(true);
      } catch (error) {
        console.log('Location search error', error);
      }
    }, 500);
  };

  const selectLocation = (item: any) => {
    setPlace(item.display_name || '');
    setLatitude(item.lat || '');
    setLongitude(item.lon || '');
    setShowSuggestions(false);
  };

  const handleContinue = () => {
    if (!birthDate || !birthTime) {
      // You can show an alert here
      console.warn('Please select date and time');
      return;
    }

    const birthData = {
      name,
      dob: formatDate(birthDate),
      tob: formatTime(birthTime),
      place,
      latitude,
      longitude,
      gender,
    };

    dispatch(setBirthDetails(birthData));
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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

          <Text style={styles.title}>{t('birthDetails.title')}</Text>
          <Text style={styles.subtitle}>{t('birthDetails.subtitle')}</Text>

          <View style={styles.form}>
            <Input
              label={t('birthDetails.name')}
              placeholder={t('birthDetails.namePlaceholder')}
              value={name}
              onChangeText={setName}
              leftIcon="user"
            />

            <Text style={styles.genderLabel}>{t('birthDetails.gender')}</Text>
            <View style={styles.genderContainer}>
              {renderGenderButton('male', t('birthDetails.male'))}
              {renderGenderButton('female', t('birthDetails.female'))}
              {renderGenderButton('other', t('birthDetails.other'))}
            </View>

            {/* ── Date Picker Field ── */}
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Input
                label={t('birthDetails.dob')}
                placeholder="YYYY-MM-DD"
                value={formatDate(birthDate)}
                editable={false}
                pointerEvents="none"
                leftIcon="calendar"
              />
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()} // can't be born in future
              />
            )}

            {/* ── Time Picker Field ── */}
            <Pressable onPress={() => setShowTimePicker(true)}>
              <Input
                label={t('birthDetails.tob')}
                placeholder="HH:MM"
                value={formatTime(birthTime)}
                editable={false}
                pointerEvents="none"
                leftIcon="clock-outline"
              />
            </Pressable>

            {showTimePicker && (
              <DateTimePicker
                value={birthTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}

            <Input
              label={t('birthDetails.place')}
              placeholder={t('birthDetails.placePlaceholder')}
              value={place}
              onChangeText={searchLocation}
            />

            {showSuggestions && locations.length > 0 && (
              <View style={styles.suggestionBox}>
                <FlatList
                  data={locations}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectLocation(item)}
                    >
                      <Text style={styles.suggestionText}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

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
  suggestionBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    maxHeight: 200,
    marginBottom: 16,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
