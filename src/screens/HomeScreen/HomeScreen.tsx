import React from 'react';
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
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

// Map sign names to zodiac icon names (MaterialCommunityIcons)
const zodiacIconMap: Record<string, string> = {
  Aries: 'zodiac-aries',
  Taurus: 'zodiac-taurus',
  Gemini: 'zodiac-gemini',
  Cancer: 'zodiac-cancer',
  Leo: 'zodiac-leo',
  Virgo: 'zodiac-virgo',
  Libra: 'zodiac-libra',
  Scorpio: 'zodiac-scorpio',
  Sagittarius: 'zodiac-sagittarius',
  Capricorn: 'zodiac-capricorn',
  Aquarius: 'zodiac-aquarius',
  Pisces: 'zodiac-pisces',
};

// Map planet names to abbreviated display labels
const planetAbbrMap: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
  Harshal: 'Ha',
  Neptune: 'Ne',
};

// Planet icon background colors
const planetColorMap: Record<string, string> = {
  Sun: '#FFE8D6',
  Moon: '#E8F0FF',
  Mars: '#FFE0E0',
  Mercury: '#D6FFE8',
  Jupiter: '#FFF4D6',
  Venus: '#FFD6F5',
  Saturn: '#E8E8FF',
  Rahu: '#F0E8FF',
  Ketu: '#FFE8F0',
};

// Sign → zodiac key for the horoscope banner
const SIGN_TO_ZODIAC: Record<string, string> = {
  Aries: 'aries',
  Taurus: 'taurus',
  Gemini: 'gemini',
  Cancer: 'cancer',
  Leo: 'leo',
  Virgo: 'virgo',
  Libra: 'libra',
  Scorpio: 'scorpio',
  Sagittarius: 'sagittarius',
  Capricorn: 'capricorn',
  Aquarius: 'aquarius',
  Pisces: 'pisces',
};

// Get house suffix
function houseSuffix(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

export function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { currentKundali, birthDetails } = useSelector(
    (state: RootState) => state.kundali,
  );

  const userName = birthDetails?.name ?? 'User';

  // ── Derived values from Kundali ──────────────────────────────────────
  const ascendantData = currentKundali?.planetary_positions?.Ascendant;
  const moonData = currentKundali?.planetary_positions?.Moon;
  const sunData = currentKundali?.planetary_positions?.Sun;
  const jupiterData = currentKundali?.planetary_positions?.Jupiter;
  const saturnData = currentKundali?.planetary_positions?.Saturn;
  const planetHousePositions = currentKundali?.planet_house_positions ?? {};

  const ascendantSign = ascendantData?.sign ?? t('home.ascendantSign');
  const ascendantNakshatra = ascendantData?.nakshatra ?? t('home.ascendantSub');
  const moonSign = moonData?.sign ?? t('home.moonSignSign');
  const moonNakshatra = moonData?.nakshatra ?? t('home.moonSignSub');

  // Zodiac icon for the horoscope banner
  const moonZodiacIcon =
    moonSign && zodiacIconMap[moonSign]
      ? zodiacIconMap[moonSign]
      : 'zodiac-virgo';

  // Top planets to show in "Planetary Snapshot"
  const keyPlanets = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Fixed Header ── */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('home.headerTitle')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Icon name="bell-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* ── Profile Card ── */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarIconContainer}>
                <Icon name="account-circle" size={64} color={colors.primary} />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.greeting}>
                {t('home.greeting', { name: userName })}
              </Text>
              <Text style={styles.dateLine}>
                {birthDetails?.dob
                  ? `Born: ${birthDetails.dob}  •  ${birthDetails.place ?? ''}`
                  : t('home.dateLine')}
              </Text>
              <View style={styles.auspiciousRow}>
                <Icon name="star-outline" size={14} color={colors.primary} />
                <Text style={styles.auspiciousText}>
                  {t('home.auspiciousTag')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Daily Horoscope Banner ── */}
        <TouchableOpacity
          style={styles.horoscopeBanner}
          activeOpacity={0.88}
          onPress={() =>
            navigation.navigate('Horoscope', {
              screen: 'DailyHoroscope',
            } as any)
          }
        >
          <View style={styles.horoscopeBannerLeft}>
            <View style={styles.horoscopeBannerIconWrap}>
              <Icon name={moonZodiacIcon} size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.horoscopeBannerEyebrow}>
                {t('home.dailyHoroscopeEyebrow')}
              </Text>
              <Text style={styles.horoscopeBannerTitle}>
                {t('home.dailyHoroscopeTitle')}
              </Text>
              {moonSign ? (
                <Text style={styles.horoscopeBannerSub}>
                  {moonSign} · {t('home.dailyHoroscopeSub')}
                </Text>
              ) : (
                <Text style={styles.horoscopeBannerSub}>
                  {t('home.dailyHoroscopeSub')}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.horoscopeBannerCta}>
            <Text style={styles.horoscopeBannerCtaText}>
              {t('home.dailyHoroscopeCta')}
            </Text>
            <Icon name="chevron-right" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* ── Natal Summary ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('home.natalSummaryTitle')}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Horoscope', {
                screen: 'KundaliOverview',
                params: {
                  name: birthDetails?.name,
                  dob: birthDetails?.dob,
                  tob: birthDetails?.tob,
                },
              } as any)
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.sectionLink}>{t('home.viewChart')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          {/* Ascendant Card */}
          <View style={[styles.summaryCard, styles.summaryCardLeft]}>
            <View style={styles.summaryIconWrapper}>
              <Icon
                name={zodiacIconMap[ascendantSign] ?? 'zodiac-virgo'}
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.summaryLabel}>{t('home.ascendantTitle')}</Text>
            <Text style={styles.summaryValue}>{ascendantSign}</Text>
            <Text style={styles.summarySub}>{ascendantNakshatra}</Text>
            {ascendantData?.sign_lord ? (
              <Text style={styles.summaryExtra}>
                Lord: {ascendantData.sign_lord}
              </Text>
            ) : null}
          </View>

          {/* Moon Sign Card */}
          <View style={[styles.summaryCard, styles.summaryCardRight]}>
            <View style={styles.summaryIconWrapper}>
              <Icon
                name={zodiacIconMap[moonSign] ?? 'moon-waning-crescent'}
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.summaryLabel}>{t('home.moonSignTitle')}</Text>
            <Text style={styles.summaryValue}>{moonSign}</Text>
            <Text style={styles.summarySub}>{moonNakshatra}</Text>
            {moonData?.nakshatra_lord ? (
              <Text style={styles.summaryExtra}>
                Star Lord: {moonData.nakshatra_lord}
              </Text>
            ) : null}
          </View>
        </View>

        {/* ── Sun Sign Card ── */}
        {sunData && (
          <View style={styles.sunCard}>
            <View style={styles.sunLeft}>
              <Icon name="white-balance-sunny" size={22} color="#FF9500" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.sunLabel}>Sun Sign</Text>
                <Text style={styles.sunValue}>
                  {sunData.sign} • {sunData.degree_in_sign}
                </Text>
                <Text style={styles.sunSub}>{sunData.nakshatra}</Text>
              </View>
            </View>
            <View style={styles.sunRight}>
              <Text style={styles.sunHouseLabel}>House</Text>
              <Text style={styles.sunHouseValue}>
                {houseSuffix(planetHousePositions['Sun'] ?? 0)}
              </Text>
            </View>
          </View>
        )}

        {/* ── Planetary Snapshot ── */}
        {currentKundali && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              Planetary Snapshot
            </Text>
            <View style={styles.planetGrid}>
              {keyPlanets.map(planet => {
                const pData = currentKundali.planetary_positions?.[planet];
                if (!pData) return null;
                const houseNum = planetHousePositions[planet];
                return (
                  <View key={planet} style={styles.planetChip}>
                    <View
                      style={[
                        styles.planetChipIcon,
                        {
                          backgroundColor: planetColorMap[planet] ?? '#F0F0F0',
                        },
                      ]}
                    >
                      <Text style={styles.planetChipAbbr}>
                        {planetAbbrMap[planet] ?? planet.slice(0, 2)}
                      </Text>
                    </View>
                    <Text style={styles.planetChipName}>{planet}</Text>
                    <Text style={styles.planetChipSign}>{pData.sign}</Text>
                    {houseNum ? (
                      <Text style={styles.planetChipHouse}>H{houseNum}</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ── Current Periods ── */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
          {t('home.currentPeriodsTitle')}
        </Text>

        <View style={styles.periodCard}>
          <View style={styles.periodIconWrapperJupiter}>
            <Text style={styles.periodIconText}>
              {planetAbbrMap['Jupiter']}
            </Text>
          </View>
          <View style={styles.periodTextWrapper}>
            <Text style={styles.periodTitle}>
              {jupiterData
                ? `Jupiter in ${jupiterData.sign}`
                : t('home.jupiterTitle')}
            </Text>
            <Text style={styles.periodSub}>
              {jupiterData
                ? `${jupiterData.nakshatra}  •  House ${
                    planetHousePositions['Jupiter'] ?? '—'
                  }`
                : t('home.jupiterSub')}
            </Text>
          </View>
        </View>

        <View style={styles.periodCard}>
          <View style={styles.periodIconWrapperSaturn}>
            <Icon name="orbit-variant" size={20} color={colors.primary} />
          </View>
          <View style={styles.periodTextWrapper}>
            <Text style={styles.periodTitle}>
              {saturnData
                ? `Saturn in ${saturnData.sign}`
                : t('home.saturnTitle')}
            </Text>
            <Text style={styles.periodSub}>
              {saturnData
                ? `${saturnData.nakshatra}  •  House ${
                    planetHousePositions['Saturn'] ?? '—'
                  }`
                : t('home.saturnSub')}
            </Text>
          </View>
          <View style={styles.periodTag}>
            <Text style={styles.periodTagText}>{t('home.retrograde')}</Text>
          </View>
        </View>

        {/* ── KP Significators Highlight (House 10 — Career) ── */}
        {currentKundali?.bhava_significators?.['10']?.length > 0 && (
          <View style={styles.kpCard}>
            <View style={styles.kpHeader}>
              <Icon name="briefcase-outline" size={18} color={colors.primary} />
              <Text style={styles.kpTitle}>10th House — Career</Text>
            </View>
            <Text style={styles.kpSub}>KP Significators</Text>
            <View style={styles.kpPillRow}>
              {currentKundali.bhava_significators['10'].map(
                (planet: string) => (
                  <View key={planet} style={styles.kpPill}>
                    <Text style={styles.kpPillText}>{planet}</Text>
                  </View>
                ),
              )}
            </View>
          </View>
        )}

        {/* ── Insight Card ── */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>{t('home.insightTitle')}</Text>
          <Text style={styles.insightBody}>
            {currentKundali
              ? `Your Ascendant in ${ascendantSign} (${ascendantNakshatra}) shapes your outward personality. With Moon in ${moonSign}, your emotional nature reflects ${
                  moonData?.nakshatra_lord ?? 'cosmic'
                } energies.`
              : t('home.insightBody')}
          </Text>
          <View style={styles.insightButton}>
            <Text style={styles.insightButtonText}>{t('home.insightCta')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  fixedHeader: { backgroundColor: colors.background, zIndex: 10 },
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },

  // Profile Card
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: {
    width: 64,
    height: 64,
    marginRight: 16,
    position: 'relative',
  },
  avatarIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  profileText: { flex: 1 },
  greeting: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  dateLine: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  auspiciousRow: { flexDirection: 'row', alignItems: 'center' },
  auspiciousText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // ── Daily Horoscope Banner ──────────────────────────────────────────────────
  horoscopeBanner: {
    backgroundColor: colors.logoBackground,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  horoscopeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  horoscopeBannerIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary + '44',
  },
  horoscopeBannerEyebrow: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  horoscopeBannerTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },
  horoscopeBannerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  horoscopeBannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  horoscopeBannerCtaText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  // Natal Summary
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: fonts.bold,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.link,
    fontFamily: fonts.medium,
  },

  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  summaryCardLeft: { marginRight: 4 },
  summaryCardRight: { marginLeft: 4 },
  summaryIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  summaryExtra: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
    fontFamily: fonts.medium,
  },

  sunCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  sunLeft: { flexDirection: 'row', alignItems: 'center' },
  sunLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  sunValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  sunSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sunRight: { alignItems: 'center' },
  sunHouseLabel: { fontSize: 11, color: colors.textSecondary },
  sunHouseValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  planetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  planetChip: {
    width: '30%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  planetChipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  planetChipAbbr: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  planetChipName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  planetChipSign: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  planetChipHouse: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontFamily: fonts.medium,
  },

  periodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  periodIconWrapperJupiter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE8D6',
    marginRight: 12,
  },
  periodIconWrapperSaturn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4D6',
    marginRight: 12,
  },
  periodIconText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  periodTextWrapper: { flex: 1 },
  periodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
    fontFamily: fonts.medium,
  },
  periodSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  periodTag: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFE3C2',
  },
  periodTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    fontFamily: fonts.medium,
  },

  kpCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  kpHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  kpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
    fontFamily: fonts.medium,
  },
  kpSub: { fontSize: 12, color: colors.textSecondary, marginBottom: 10 },
  kpPillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kpPill: {
    backgroundColor: colors.logoBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  kpPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: fonts.medium,
  },

  insightCard: {
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginBottom: 8,
    fontFamily: fonts.bold,
  },
  insightBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textOnPrimary,
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  insightButton: {
    alignSelf: 'flex-start',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  insightButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.medium,
  },
});
