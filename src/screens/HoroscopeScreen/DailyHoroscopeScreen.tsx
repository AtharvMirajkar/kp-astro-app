import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Share,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HoroscopeRatings {
  health: string;
  wealth: string;
  family: string;
  loveMatters: string;
  occupation: string;
  marriedLife: string;
}

interface HoroscopeData {
  sign: string;
  date: string;
  language: string;
  prediction: string;
  luckyNumber: string;
  luckyColor: string;
  remedy: string;
  ratings: HoroscopeRatings;
  author: string;
  updatedDate: string;
  sourceUrl: string;
  lastUpdated: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ZODIAC_SIGNS = [
  { sign: 'aries', icon: 'zodiac-aries', label: 'Aries', labelHi: 'मेष', labelMr: 'मेष' },
  { sign: 'taurus', icon: 'zodiac-taurus', label: 'Taurus', labelHi: 'वृषभ', labelMr: 'वृषभ' },
  { sign: 'gemini', icon: 'zodiac-gemini', label: 'Gemini', labelHi: 'मिथुन', labelMr: 'मिथुन' },
  { sign: 'cancer', icon: 'zodiac-cancer', label: 'Cancer', labelHi: 'कर्क', labelMr: 'कर्क' },
  { sign: 'leo', icon: 'zodiac-leo', label: 'Leo', labelHi: 'सिंह', labelMr: 'सिंह' },
  { sign: 'virgo', icon: 'zodiac-virgo', label: 'Virgo', labelHi: 'कन्या', labelMr: 'कन्या' },
  { sign: 'libra', icon: 'zodiac-libra', label: 'Libra', labelHi: 'तुला', labelMr: 'तुला' },
  { sign: 'scorpio', icon: 'zodiac-scorpio', label: 'Scorpio', labelHi: 'वृश्चिक', labelMr: 'वृश्चिक' },
  { sign: 'sagittarius', icon: 'zodiac-sagittarius', label: 'Sagittarius', labelHi: 'धनु', labelMr: 'धनु' },
  { sign: 'capricorn', icon: 'zodiac-capricorn', label: 'Capricorn', labelHi: 'मकर', labelMr: 'मकर' },
  { sign: 'aquarius', icon: 'zodiac-aquarius', label: 'Aquarius', labelHi: 'कुम्भ', labelMr: 'कुंभ' },
  { sign: 'pisces', icon: 'zodiac-pisces', label: 'Pisces', labelHi: 'मीन', labelMr: 'मीन' },
];

// Map moon sign from kundali to zodiac sign key
const SIGN_TO_ZODIAC: Record<string, string> = {
  Aries: 'aries', Taurus: 'taurus', Gemini: 'gemini', Cancer: 'cancer',
  Leo: 'leo', Virgo: 'virgo', Libra: 'libra', Scorpio: 'scorpio',
  Sagittarius: 'sagittarius', Capricorn: 'capricorn', Aquarius: 'aquarius', Pisces: 'pisces',
  // Hindi
  मेष: 'aries', वृषभ: 'taurus', मिथुन: 'gemini', कर्क: 'cancer',
  सिंह: 'leo', कन्या: 'virgo', तुला: 'libra', वृश्चिक: 'scorpio',
  धनु: 'sagittarius', मकर: 'capricorn', 'कुम्भ': 'aquarius', मीन: 'pisces',
  // Marathi
  'कुंभ': 'aquarius',
};

const RATING_CONFIG: { key: keyof HoroscopeRatings; icon: string; color: string; labelEn: string; labelHi: string; labelMr: string }[] = [
  { key: 'health', icon: 'heart-pulse', color: '#E07A5F', labelEn: 'Health', labelHi: 'स्वास्थ्य', labelMr: 'आरोग्य' },
  { key: 'wealth', icon: 'cash-multiple', color: '#3BAA72', labelEn: 'Wealth', labelHi: 'धन', labelMr: 'संपत्ती' },
  { key: 'family', icon: 'home-heart', color: '#3B82B8', labelEn: 'Family', labelHi: 'परिवार', labelMr: 'कुटुंब' },
  { key: 'loveMatters', icon: 'heart', color: '#E07A8C', labelEn: 'Love', labelHi: 'प्रेम', labelMr: 'प्रेम' },
  { key: 'occupation', icon: 'briefcase-outline', color: '#C9A227', labelEn: 'Career', labelHi: 'कार्य', labelMr: 'कार्य' },
  { key: 'marriedLife', icon: 'ring', color: '#8E4E9E', labelEn: 'Marriage', labelHi: 'विवाह', labelMr: 'विवाह' },
];

const BASE_URL = 'https://kp-astro-backend.onrender.com';

// ─── Helper functions ─────────────────────────────────────────────────────────

function parseRating(ratingStr: string): number {
  // "3/5" → 3
  const parts = ratingStr?.split('/');
  return parts ? parseInt(parts[0], 10) : 0;
}

function getLanguageCode(i18nLang: string): string {
  if (i18nLang.startsWith('hi')) return 'hi';
  if (i18nLang.startsWith('mr')) return 'mr';
  return 'en';
}

function getSignLabel(zodiac: typeof ZODIAC_SIGNS[0], lang: string): string {
  if (lang === 'hi') return zodiac.labelHi;
  if (lang === 'mr') return zodiac.labelMr;
  return zodiac.label;
}

function getRatingLabel(config: typeof RATING_CONFIG[0], lang: string): string {
  if (lang === 'hi') return config.labelHi;
  if (lang === 'mr') return config.labelMr;
  return config.labelEn;
}

// ─── Rating Bar Component ─────────────────────────────────────────────────────

function RatingBar({ score, color }: { score: number; color: string }) {
  const total = 5;
  return (
    <View style={ratingStyles.barContainer}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            ratingStyles.barSegment,
            { backgroundColor: i < score ? color : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const ratingStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    gap: 3,
    flex: 1,
  },
  barSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function DailyHoroscopeScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const lang = getLanguageCode(i18n.language);

  const { currentKundali } = useSelector((state: RootState) => state.kundali);

  // Detect user's moon sign → map to zodiac
  const moonSign = currentKundali?.planetary_positions?.Moon?.sign ?? '';
  const defaultSign = SIGN_TO_ZODIAC[moonSign] ?? 'aries';
  const defaultZodiacIndex = ZODIAC_SIGNS.findIndex(z => z.sign === defaultSign);

  const [selectedIndex, setSelectedIndex] = useState(defaultZodiacIndex >= 0 ? defaultZodiacIndex : 0);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const selectedZodiac = ZODIAC_SIGNS[selectedIndex];

  const fetchHoroscope = useCallback(async (sign: string, language: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/horoscope/${sign}?language=${language}`);
      const json = await res.json();
      if (json.success && json.found) {
        setHoroscope(json.data);
      } else {
        setError('Horoscope not available for today.');
      }
    } catch (e) {
      setError('Failed to load horoscope. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHoroscope(selectedZodiac.sign, lang);
  }, [selectedZodiac.sign, lang, fetchHoroscope]);

  const handleShare = async () => {
    if (!horoscope) return;
    try {
      await Share.share({
        message: `${selectedZodiac.label} Horoscope — ${horoscope.updatedDate}\n\n${horoscope.prediction}\n\n🍀 Lucky Number: ${horoscope.luckyNumber}\n🎨 Lucky Color: ${horoscope.luckyColor}\n💊 Remedy: ${horoscope.remedy}`,
        title: `${selectedZodiac.label} Daily Horoscope`,
      });
    } catch (_) {}
  };

  const renderRatings = () => {
    if (!horoscope) return null;
    return (
      <View style={styles.ratingsGrid}>
        {RATING_CONFIG.map(cfg => {
          const score = parseRating(horoscope.ratings[cfg.key]);
          return (
            <View key={cfg.key} style={styles.ratingItem}>
              <View style={[styles.ratingIconWrap, { backgroundColor: cfg.color + '22' }]}>
                <Icon name={cfg.icon} size={16} color={cfg.color} />
              </View>
              <View style={styles.ratingContent}>
                <View style={styles.ratingTopRow}>
                  <Text style={styles.ratingLabel}>{getRatingLabel(cfg, lang)}</Text>
                  <Text style={[styles.ratingScore, { color: cfg.color }]}>
                    {horoscope.ratings[cfg.key]}
                  </Text>
                </View>
                <RatingBar score={score} color={cfg.color} />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
        >
          <Icon name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {lang === 'hi' ? 'दैनिक राशिफल' : lang === 'mr' ? 'दैनिक राशिभविष्य' : 'Daily Horoscope'}
          </Text>
          {horoscope && (
            <Text style={styles.headerSub}>{horoscope.updatedDate}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
          disabled={!horoscope}
        >
          <Icon name="share-variant" size={20} color={horoscope ? colors.textPrimary : colors.border} />
        </TouchableOpacity>
      </View>

      {/* ── Zodiac Sign Selector ── */}
      <View style={styles.signSelectorWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.signSelectorContent}
        >
          {ZODIAC_SIGNS.map((zodiac, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <Pressable
                key={zodiac.sign}
                onPress={() => setSelectedIndex(idx)}
                style={[styles.signChip, isSelected && styles.signChipActive]}
              >
                <Icon
                  name={zodiac.icon}
                  size={20}
                  color={isSelected ? colors.textOnPrimary : colors.textSecondary}
                />
                <Text style={[styles.signChipText, isSelected && styles.signChipTextActive]}>
                  {getSignLabel(zodiac, lang)}
                </Text>
                {moonSign && SIGN_TO_ZODIAC[moonSign] === zodiac.sign && (
                  <View style={[styles.mySignDot, isSelected && styles.mySignDotActive]} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Main Content ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchHoroscope(selectedZodiac.sign, lang, true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {lang === 'hi' ? 'राशिफल लोड हो रहा है...' : lang === 'mr' ? 'राशिभविष्य लोड होत आहे...' : 'Loading your horoscope...'}
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Icon name="alert-circle-outline" size={48} color={colors.textMuted} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchHoroscope(selectedZodiac.sign, lang)}
            >
              <Text style={styles.retryButtonText}>
                {lang === 'hi' ? 'पुनः प्रयास करें' : lang === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : horoscope ? (
          <>
            {/* ── Hero Card ── */}
            <View style={styles.heroCard}>
              <View style={styles.heroLeft}>
                <View style={styles.heroIconWrap}>
                  <Icon name={selectedZodiac.icon} size={40} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroSign}>{getSignLabel(selectedZodiac, lang)}</Text>
                  <Text style={styles.heroDate}>{horoscope.updatedDate}</Text>
                  <Text style={styles.heroAuthor}>by {horoscope.author}</Text>
                </View>
              </View>
              {moonSign && SIGN_TO_ZODIAC[moonSign] === selectedZodiac.sign && (
                <View style={styles.mySignBadge}>
                  <Icon name="moon-waning-crescent" size={12} color={colors.primary} />
                  <Text style={styles.mySignBadgeText}>
                    {lang === 'hi' ? 'आपकी राशि' : lang === 'mr' ? 'तुमची राशी' : 'Your Sign'}
                  </Text>
                </View>
              )}
            </View>

            {/* ── Lucky Info ── */}
            <View style={styles.luckyRow}>
              <View style={styles.luckyItem}>
                <View style={styles.luckyIconWrap}>
                  <Icon name="numeric" size={18} color="#C9A227" />
                </View>
                <Text style={styles.luckyLabel}>
                  {lang === 'hi' ? 'शुभ अंक' : lang === 'mr' ? 'शुभ अंक' : 'Lucky No.'}
                </Text>
                <Text style={styles.luckyValue}>{horoscope.luckyNumber}</Text>
              </View>
              <View style={styles.luckyDivider} />
              <View style={styles.luckyItem}>
                <View style={[styles.luckyIconWrap, { backgroundColor: '#3BAA7222' }]}>
                  <Icon name="palette-outline" size={18} color="#3BAA72" />
                </View>
                <Text style={styles.luckyLabel}>
                  {lang === 'hi' ? 'शुभ रंग' : lang === 'mr' ? 'शुभ रंग' : 'Lucky Color'}
                </Text>
                <Text style={styles.luckyValue} numberOfLines={2}>{horoscope.luckyColor}</Text>
              </View>
            </View>

            {/* ── Prediction ── */}
            <View style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Icon name="text-box-outline" size={16} color={colors.primary} />
                <Text style={styles.predictionTitle}>
                  {lang === 'hi' ? 'आज का राशिफल' : lang === 'mr' ? 'आजचे राशिभविष्य' : "Today's Prediction"}
                </Text>
              </View>
              <Text style={styles.predictionText}>{horoscope.prediction}</Text>
            </View>

            {/* ── Ratings ── */}
            <Text style={styles.sectionTitle}>
              {lang === 'hi' ? 'आज की ग्रह स्थिति' : lang === 'mr' ? 'आजची ग्रह स्थिती' : "Today's Ratings"}
            </Text>
            <View style={styles.ratingsCard}>
              {renderRatings()}
            </View>

            {/* ── Remedy ── */}
            <View style={styles.remedyCard}>
              <View style={styles.remedyHeader}>
                <Icon name="leaf" size={16} color="#3BAA72" />
                <Text style={styles.remedyTitle}>
                  {lang === 'hi' ? 'आज का उपाय' : lang === 'mr' ? 'आजचा उपाय' : "Today's Remedy"}
                </Text>
              </View>
              <Text style={styles.remedyText}>{horoscope.remedy}</Text>
            </View>

            {/* ── Source Attribution ── */}
            <Text style={styles.attribution}>
              {lang === 'hi' ? `स्रोत: AstroSage · ${horoscope.updatedDate}` : lang === 'mr' ? `स्रोत: AstroSage · ${horoscope.updatedDate}` : `Source: AstroSage · ${horoscope.updatedDate}`}
            </Text>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerBtn: { padding: 4, minWidth: 36 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, color: colors.textPrimary, fontFamily: fonts.bold },
  headerSub: { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.regular, marginTop: 1 },

  // Sign Selector
  signSelectorWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  signSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  signChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
  },
  signChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  signChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },
  signChipTextActive: {
    color: colors.textOnPrimary,
    fontFamily: fonts.bold,
  },
  mySignDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  mySignDotActive: {
    backgroundColor: '#FFD700',
    borderColor: colors.primary,
  },

  // Scroll
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },

  // Loading / Error
  loadingWrap: { alignItems: 'center', paddingTop: 80, gap: 16 },
  loadingText: { fontSize: 14, color: colors.textSecondary, fontFamily: fonts.regular },
  errorWrap: { alignItems: 'center', paddingTop: 80, gap: 12 },
  errorText: { fontSize: 14, color: colors.textSecondary, fontFamily: fonts.regular, textAlign: 'center', paddingHorizontal: 24 },
  retryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: { fontSize: 14, color: colors.textOnPrimary, fontFamily: fonts.bold },

  // Hero Card
  heroCard: {
    backgroundColor: colors.logoBackground,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  heroLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '44',
  },
  heroSign: { fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bold, marginBottom: 4 },
  heroDate: { fontSize: 13, color: colors.textSecondary, fontFamily: fonts.regular, marginBottom: 2 },
  heroAuthor: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.regular },
  mySignBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    backgroundColor: colors.backgroundSecondary,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  mySignBadgeText: { fontSize: 11, color: colors.primary, fontFamily: fonts.bold },

  // Lucky Row
  luckyRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  luckyItem: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12 },
  luckyDivider: { width: 1, backgroundColor: colors.border },
  luckyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C9A22722',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  luckyLabel: { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.regular, marginBottom: 4 },
  luckyValue: { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.bold, textAlign: 'center' },

  // Prediction
  predictionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  predictionTitle: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  predictionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 23,
  },

  // Ratings
  sectionTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },
  ratingsCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingsGrid: { gap: 4 },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '80',
  },
  ratingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContent: { flex: 1, gap: 6 },
  ratingTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingLabel: { fontSize: 13, color: colors.textPrimary, fontFamily: fonts.medium },
  ratingScore: { fontSize: 12, fontFamily: fonts.bold },

  // Remedy
  remedyCard: {
    backgroundColor: '#EBF7F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3BAA7244',
  },
  remedyHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  remedyTitle: {
    fontSize: 13,
    color: '#3BAA72',
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  remedyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },

  // Attribution
  attribution: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginBottom: 8,
  },
});
