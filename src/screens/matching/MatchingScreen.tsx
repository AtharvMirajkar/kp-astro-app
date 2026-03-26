import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input, PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import type { MatchingScreenProps } from '../../types/navigation';

type Gender = 'male' | 'female';

export function MatchingScreen({ navigation }: MatchingScreenProps) {
  const { t } = useTranslation();

  // Partner 1
  const [gender1, setGender1] = useState<Gender>('male');
  const [name1, setName1] = useState('');
  const [dob1, setDob1] = useState<Date | null>(null);
  const [tob1, setTob1] = useState<Date | null>(null);
  const [location1, setLocation1] = useState('');
  const [lat1, setLat1] = useState('');
  const [lon1, setLon1] = useState('');
  const [suggestions1, setSuggestions1] = useState<any[]>([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);

  // Partner 2
  const [gender2, setGender2] = useState<Gender>('female');
  const [name2, setName2] = useState('');
  const [dob2, setDob2] = useState<Date | null>(null);
  const [tob2, setTob2] = useState<Date | null>(null);
  const [location2, setLocation2] = useState('');
  const [lat2, setLat2] = useState('');
  const [lon2, setLon2] = useState('');
  const [suggestions2, setSuggestions2] = useState<any[]>([]);
  const [showSuggestions2, setShowSuggestions2] = useState(false);

  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  const debounceTimeout1 = useRef<number | null>(null);
  const debounceTimeout2 = useRef<number | null>(null);

  // Auto-sync gender
  useEffect(() => {
    if (gender1 === 'male') setGender2('female');
    else setGender2('male');
  }, [gender1]);

  useEffect(() => {
    if (gender2 === 'male') setGender1('female');
    else setGender1('male');
  }, [gender2]);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split('T')[0] : '';
  const formatTime = (time: Date | null) =>
    time
      ? time.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

  // Location Search with debounce
  const searchLocation = (text: string, isPartner1: boolean) => {
    const setLocation = isPartner1 ? setLocation1 : setLocation2;
    const setSuggestions = isPartner1 ? setSuggestions1 : setSuggestions2;
    const setShowSuggestions = isPartner1
      ? setShowSuggestions1
      : setShowSuggestions2;
    const timeoutRef = isPartner1 ? debounceTimeout1 : debounceTimeout2;

    setLocation(text);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
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
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.log('Location search error', error);
      }
    }, 500);
  };

  const selectLocation = (item: any, isPartner1: boolean) => {
    if (isPartner1) {
      setLocation1(item.display_name || '');
      setLat1(item.lat || '');
      setLon1(item.lon || '');
      setSuggestions1([]);
      setShowSuggestions1(false);
    } else {
      setLocation2(item.display_name || '');
      setLat2(item.lat || '');
      setLon2(item.lon || '');
      setSuggestions2([]);
      setShowSuggestions2(false);
    }
  };

  const handleCalculate = () => {
    navigation.navigate('CompatibilityReport');
  };

  const renderGenderButtons = (
    gender: Gender,
    onChange: (g: Gender) => void,
  ) => (
    <View style={styles.genderContainer}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'male' && styles.genderButtonActive,
        ]}
        onPress={() => onChange('male')}
      >
        <Text
          style={[
            styles.genderText,
            gender === 'male' && styles.genderTextActive,
          ]}
        >
          {t('matching.genderMale')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'female' && styles.genderButtonActive,
        ]}
        onPress={() => onChange('female')}
      >
        <Text
          style={[
            styles.genderText,
            gender === 'female' && styles.genderTextActive,
          ]}
        >
          {t('matching.genderFemale')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('matching.screenTitle')}</Text>
          <TouchableOpacity>
            <Icon name="information-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionIntro}>
          <Text style={styles.sectionTitle}>{t('matching.checkTitle')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('matching.checkSubtitle')}
          </Text>
        </View>

        {/* Partner 1 */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <Icon name="account-outline" size={18} color={colors.primary} />
            <Text style={styles.partnerTitle}>
              {t('matching.firstPartner')}
            </Text>
          </View>

          <Input
            label={t('matching.fullNameLabel')}
            placeholder={t('matching.fullNamePlaceholder1')}
            value={name1}
            onChangeText={setName1}
            leftIcon="user"
          />

          <Text style={styles.fieldLabel}>{t('matching.genderLabel')}</Text>
          {renderGenderButtons(gender1, setGender1)}

          <Pressable onPress={() => setShowDatePicker1(true)}>
            <Input
              label={t('matching.dobLabel')}
              placeholder={t('matching.dobPlaceholder')}
              value={formatDate(dob1)}
              editable={false}
              pointerEvents="none"
              leftIcon="calendar"
            />
          </Pressable>

          <Pressable onPress={() => setShowTimePicker1(true)}>
            <Input
              label={t('matching.tobLabel')}
              placeholder={t('matching.tobPlaceholder')}
              value={formatTime(tob1)}
              editable={false}
              pointerEvents="none"
              leftIcon="clock-outline"
            />
          </Pressable>

          <Input
            label={t('matching.birthLocationLabel')}
            placeholder={t('matching.birthLocationPlaceholder')}
            value={location1}
            onChangeText={text => searchLocation(text, true)}
            leftIcon="location"
          />

          {showSuggestions1 && suggestions1.length > 0 && (
            <View style={styles.suggestionBox}>
              <FlatList
                data={suggestions1}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectLocation(item, true)}
                  >
                    <Text style={styles.suggestionText}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Heart Separator */}
        <View style={styles.heartSeparator}>
          <View style={styles.heartCircle}>
            <Icon name="heart" size={28} color={colors.textOnPrimary} />
          </View>
        </View>

        {/* Partner 2 */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <Icon name="account-outline" size={18} color={colors.primary} />
            <Text style={styles.partnerTitle}>
              {t('matching.secondPartner')}
            </Text>
          </View>

          <Input
            label={t('matching.fullNameLabel')}
            placeholder={t('matching.fullNamePlaceholder2')}
            value={name2}
            onChangeText={setName2}
            leftIcon="user"
          />

          <Text style={styles.fieldLabel}>{t('matching.genderLabel')}</Text>
          {renderGenderButtons(gender2, setGender2)}

          <Pressable onPress={() => setShowDatePicker2(true)}>
            <Input
              label={t('matching.dobLabel')}
              placeholder={t('matching.dobPlaceholder')}
              value={formatDate(dob2)}
              editable={false}
              pointerEvents="none"
              leftIcon="calendar"
            />
          </Pressable>

          <Pressable onPress={() => setShowTimePicker2(true)}>
            <Input
              label={t('matching.tobLabel')}
              placeholder={t('matching.tobPlaceholder')}
              value={formatTime(tob2)}
              editable={false}
              pointerEvents="none"
              leftIcon="clock-outline"
            />
          </Pressable>

          <Input
            label={t('matching.birthLocationLabel')}
            placeholder={t('matching.birthLocationPlaceholder')}
            value={location2}
            onChangeText={text => searchLocation(text, false)}
            leftIcon="location"
          />

          {showSuggestions2 && suggestions2.length > 0 && (
            <View style={styles.suggestionBox}>
              <FlatList
                data={suggestions2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectLocation(item, false)}
                  >
                    <Text style={styles.suggestionText}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Date & Time Pickers */}
        {showDatePicker1 && (
          <DateTimePicker
            value={dob1 || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(e, date) => {
              setShowDatePicker1(Platform.OS === 'ios');
              if (date) setDob1(date);
            }}
            maximumDate={new Date()}
          />
        )}

        {showTimePicker1 && (
          <DateTimePicker
            value={tob1 || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, time) => {
              setShowTimePicker1(Platform.OS === 'ios');
              if (time) setTob1(time);
            }}
          />
        )}

        {showDatePicker2 && (
          <DateTimePicker
            value={dob2 || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(e, date) => {
              setShowDatePicker2(Platform.OS === 'ios');
              if (date) setDob2(date);
            }}
            maximumDate={new Date()}
          />
        )}

        {showTimePicker2 && (
          <DateTimePicker
            value={tob2 || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, time) => {
              setShowTimePicker2(Platform.OS === 'ios');
              if (time) setTob2(time);
            }}
          />
        )}

        <View style={styles.ctaWrapper}>
          <PrimaryButton title={t('matching.cta')} onPress={handleCalculate} />
          <Text style={styles.footerNote}>{t('matching.footerNote')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  fixedHeader: {
    backgroundColor: colors.background,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionIntro: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    lineHeight: 20,
    textAlign: 'center',
  },

  partnerCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 10,
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
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

  heartSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  heartCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  suggestionBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    maxHeight: 180,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  ctaWrapper: { marginTop: 16 },
  footerNote: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
