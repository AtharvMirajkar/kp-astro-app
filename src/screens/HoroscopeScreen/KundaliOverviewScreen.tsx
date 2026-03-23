import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Svg, { Polygon, Line, Text as SvgText, G } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import type { KundaliOverviewScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

const CHART_COLOR = '#C9A227';
const CHART_BG = '#FDFBF7';

// ─── Planet key maps per language ─────────────────────────────────────────────
// API uses different keys in planetary_positions / planet_house_positions
// depending on the language param used.
// English: "Sun", "Moon", "Mars" …
// Hindi:   "सूर्य", "चन्द्र", "मंगल" …  (note: चन्द्र)
// Marathi: "सूर्य", "चंद्र",  "मंगळ" …  (note: चंद्र, मंगळ, गुरू, शनी, राहू, केतू)

type PlanetKey = {
  en: string; // API key for English response
  hi: string; // API key for Hindi response
  mr: string; // API key for Marathi response
  icon: string; // MaterialCommunityIcons name
};

const PLANET_MAP: PlanetKey[] = [
  { en: 'Sun', hi: 'सूर्य', mr: 'सूर्य', icon: 'white-balance-sunny' },
  { en: 'Moon', hi: 'चन्द्र', mr: 'चंद्र', icon: 'moon-waning-crescent' },
  { en: 'Mars', hi: 'मंगल', mr: 'मंगळ', icon: 'fire' },
  { en: 'Mercury', hi: 'बुध', mr: 'बुध', icon: 'mercury' },
  { en: 'Jupiter', hi: 'गुरु', mr: 'गुरू', icon: 'star' },
  { en: 'Venus', hi: 'शुक्र', mr: 'शुक्र', icon: 'heart' },
  { en: 'Saturn', hi: 'शनि', mr: 'शनी', icon: 'orbit-variant' },
  { en: 'Rahu', hi: 'राहु', mr: 'राहू', icon: 'arrow-up-circle' },
  { en: 'Ketu', hi: 'केतु', mr: 'केतू', icon: 'arrow-down-circle' },
  { en: 'Harshal', hi: 'हर्षल', mr: 'हर्षल', icon: 'circle-outline' },
  { en: 'Neptune', hi: 'नेप्च्यून', mr: 'नेप्च्यून', icon: 'water-outline' },
];

// Ascendant key also differs per language
const ASCENDANT_KEY: Record<string, string> = {
  en: 'Ascendant',
  hi: 'लग्न',
  mr: 'लग्न',
};

// Returns the API key for a planet given the active language
function getPlanetApiKey(planet: PlanetKey, lang: string): string {
  if (lang === 'hi') return planet.hi;
  if (lang === 'mr') return planet.mr;
  return planet.en;
}

// ─── Sign abbreviations per language ─────────────────────────────────────────
// Sign names in API responses per language — maps full name → short abbr for SVG chart

const SIGN_ABBR: Record<string, Record<string, string>> = {
  en: {
    Aries: 'Ar',
    Taurus: 'Ta',
    Gemini: 'Ge',
    Cancer: 'Ca',
    Leo: 'Le',
    Virgo: 'Vi',
    Libra: 'Li',
    Scorpio: 'Sc',
    Sagittarius: 'Sg',
    Capricorn: 'Cp',
    Aquarius: 'Aq',
    Pisces: 'Pi',
  },
  hi: {
    मेष: 'मेष',
    वृषभ: 'वृष',
    मिथुन: 'मिथु',
    कर्क: 'कर्क',
    सिंह: 'सिंह',
    कन्या: 'कन्या',
    तुला: 'तुला',
    वृश्चिक: 'वृश्चि',
    धनु: 'धनु',
    मकर: 'मकर',
    कुम्भ: 'कुम्भ',
    मीन: 'मीन',
  },
  mr: {
    मेष: 'मेष',
    वृषभ: 'वृष',
    मिथुन: 'मिथु',
    कर्क: 'कर्क',
    सिंह: 'सिंह',
    कन्या: 'कन्या',
    तुला: 'तुला',
    वृश्चिक: 'वृश्चि',
    धनु: 'धनु',
    मकर: 'मकर',
    कुंभ: 'कुंभ',
    मीन: 'मीन',
  },
};

function getSignAbbr(signName: string, lang: string): string {
  if (!signName) return '—';
  const map = SIGN_ABBR[lang] ?? SIGN_ABBR.en;
  return map[signName] ?? signName.slice(0, 2);
}

// ─── North Indian Chart SVG ───────────────────────────────────────────────────

interface NorthIndianChartProps {
  size: number;
  houseToSign: Record<number, string>; // house# → sign name in API language
  planetsByHouse: Record<number, string[]>; // house# → planet names (API language, trimmed)
}

function NorthIndianChart({
  size,
  houseToSign,
  planetsByHouse,
}: NorthIndianChartProps) {
  const s = size,
    h = s / 2,
    q = s / 4,
    tq = (s * 3) / 4;

  const pts: Record<string, number[]> = {
    TL: [0, 0],
    TM: [h, 0],
    TR: [s, 0],
    LM: [0, h],
    C: [h, h],
    RM: [s, h],
    BL: [0, s],
    BM: [h, s],
    BR: [s, s],
    IT: [h, q],
    IR: [tq, h],
    IB: [h, tq],
    IL: [q, h],
  };

  const poly = (points: number[][]): string =>
    points.map(p => p.join(',')).join(' ');

  const centroid = (ps: number[][]): [number, number] => [
    ps.reduce((a, p) => a + p[0], 0) / ps.length,
    ps.reduce((a, p) => a + p[1], 0) / ps.length,
  ];

  const housePolygons: Record<number, number[][]> = {
    1: [pts.TM, pts.TR, pts.C],
    2: [pts.TR, pts.RM, pts.C],
    3: [pts.RM, pts.BR, pts.C],
    4: [pts.BR, pts.BM, pts.C],
    5: [pts.BM, pts.BL, pts.C],
    6: [pts.BL, pts.LM, pts.C],
    7: [pts.LM, pts.TL, pts.C],
    8: [pts.TL, pts.TM, pts.C],
    9: [pts.IT, pts.IR, pts.C],
    10: [pts.IR, pts.IB, pts.C],
    11: [pts.IB, pts.IL, pts.C],
    12: [pts.IL, pts.IT, pts.C],
  };

  const allLines = [
    [pts.TL, pts.TR],
    [pts.TR, pts.BR],
    [pts.BR, pts.BL],
    [pts.BL, pts.TL],
    [pts.TL, pts.C],
    [pts.TR, pts.C],
    [pts.BR, pts.C],
    [pts.BL, pts.C],
    [pts.TM, pts.C],
    [pts.RM, pts.C],
    [pts.BM, pts.C],
    [pts.LM, pts.C],
    [pts.IT, pts.IR],
    [pts.IR, pts.IB],
    [pts.IB, pts.IL],
    [pts.IL, pts.IT],
  ];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${s} ${s}`}>
      <Polygon
        points={poly([pts.TL, pts.TR, pts.BR, pts.BL])}
        fill={CHART_BG}
        stroke={CHART_COLOR}
        strokeWidth="1.5"
      />

      {Object.entries(housePolygons).map(([houseNum, polyPts]) => {
        const hNum = parseInt(houseNum);
        const [cx, cy] = centroid(polyPts);
        const planets = planetsByHouse[hNum] ?? [];
        const signAbbr = houseToSign[hNum] ?? '';

        return (
          <G key={houseNum}>
            <Polygon
              points={poly(polyPts)}
              fill={hNum === 1 ? `${CHART_COLOR}22` : 'transparent'}
              stroke={CHART_COLOR}
              strokeWidth="1"
            />
            {/* House number */}
            <SvgText
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              fontSize="9"
              fill={CHART_COLOR}
              fontWeight="bold"
            >
              {hNum}
            </SvgText>
            {/* Sign abbr (from API, already in selected language) */}
            {signAbbr ? (
              <SvgText
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                fontSize="8"
                fill="#6B5E3E"
                fontWeight="600"
              >
                {signAbbr}
              </SvgText>
            ) : null}
            {/* Planet names trimmed for chart */}
            {planets.slice(0, 3).map((p, i) => (
              <SvgText
                key={p + i}
                x={cx}
                y={cy + 12 + i * 10}
                textAnchor="middle"
                fontSize="8"
                fill="#1A1A2E"
                fontWeight="700"
              >
                {p}
              </SvgText>
            ))}
          </G>
        );
      })}

      {allLines.map(([p1, p2], i) => (
        <Line
          key={i}
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke={CHART_COLOR}
          strokeWidth="1"
        />
      ))}
    </Svg>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function KundaliOverviewScreen({
  navigation,
  route,
}: KundaliOverviewScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] ?? 'en'; // 'en' | 'hi' | 'mr'

  const [activeTab, setActiveTab] = useState<'rashi' | 'bhav' | 'kp' | 'd9'>(
    'rashi',
  );

  const { currentKundali, birthDetails } = useSelector(
    (state: RootState) => state.kundali,
  );

  const name = route.params?.name ?? birthDetails?.name ?? 'Unknown';
  const dob = route.params?.dob ?? birthDetails?.dob ?? '';
  const tob = route.params?.tob ?? birthDetails?.tob ?? '';
  const birthDetail =
    dob && tob ? `${dob}, ${tob}` : t('kundaliOverview.birthSubtitle');

  // ── Raw API data ──────────────────────────────────────────────────────────
  const positions: Record<string, any> =
    currentKundali?.planetary_positions ?? {};
  const planetHousePositions: Record<string, number> =
    currentKundali?.planet_house_positions ?? {};
  const cuspDetails: Record<string, any> = currentKundali?.cusp_details ?? {};
  const bhavaSignificators: Record<string, any> =
    currentKundali?.bhava_significators ?? {};
  const kpSignificators: Record<string, any> =
    currentKundali?.kp_significators ?? {};

  // ── Ascendant data ────────────────────────────────────────────────────────
  const ascKey = ASCENDANT_KEY[lang] ?? 'Ascendant';
  const ascData = positions[ascKey] ?? {};

  // ── Moon data ─────────────────────────────────────────────────────────────
  const moonPlanet = PLANET_MAP.find(p => p.en === 'Moon')!;
  const moonKey = getPlanetApiKey(moonPlanet, lang);
  const moonData = positions[moonKey] ?? {};

  // ── House → sign name mapping (from cusp_details, sign already in API lang) ──
  const houseToSign: Record<number, string> = {};
  for (let h = 1; h <= 12; h++) {
    const signName = cuspDetails[String(h)]?.sign ?? '';
    houseToSign[h] = getSignAbbr(signName, lang);
  }

  // ── House → planet list for chart ─────────────────────────────────────────
  // planet_house_positions keys are in API language, values are house numbers
  const planetsByHouse: Record<number, string[]> = {};
  Object.entries(planetHousePositions).forEach(([planetName, houseNum]) => {
    const house = Number(houseNum);
    if (!planetsByHouse[house]) planetsByHouse[house] = [];
    // Trim long names for chart readability
    planetsByHouse[house].push(planetName.slice(0, 3));
  });

  // ── Planet table rows ─────────────────────────────────────────────────────
  // Use PLANET_MAP to get the correct key per language and look up positions
  const planetRows = PLANET_MAP.map(planet => {
    const apiKey = getPlanetApiKey(planet, lang);
    const pData = positions[apiKey] ?? {};
    const house = planetHousePositions[apiKey] ?? 0;
    return {
      enKey: planet.en, // for icon lookup
      icon: planet.icon,
      label: apiKey, // display name in API language
      sign: pData.sign ?? t('kundaliOverview.noData'),
      deg: pData.degree_in_sign ?? t('kundaliOverview.noData'),
      nakshatra: pData.nakshatra ?? t('kundaliOverview.noData'),
      signLord: pData.sign_lord ?? t('kundaliOverview.noData'),
      house,
    };
  });

  // ── KP & Bhava: keys in API language ─────────────────────────────────────
  const kpRows = Object.entries(kpSignificators);
  const bhavaRows = Object.entries(bhavaSignificators);

  const handleShare = async () => {
    try {
      await Share.share({ message: `${name} - Kundali • ${birthDetail}` });
    } catch (_) {}
  };

  const tabs = [
    { key: 'rashi' as const, label: t('kundaliOverview.tabRashi') },
    { key: 'bhav' as const, label: t('kundaliOverview.tabBhav') },
    { key: 'kp' as const, label: t('kundaliOverview.tabKP') },
    { key: 'd9' as const, label: t('kundaliOverview.tabD9') },
  ];

  const chartSize = Dimensions.get('window').width - 48;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {t('kundaliOverview.screenTitle')}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {name} • {birthDetail}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="share-variant" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabsRow}>
          {tabs.map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => setActiveTab(key)}
              style={[styles.tab, activeTab === key && styles.tabActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === key && styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
              {activeTab === key && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        {/* ── North Indian Chart ── */}
        <View
          style={[
            styles.chartContainer,
            { width: chartSize, height: chartSize },
          ]}
        >
          <NorthIndianChart
            size={chartSize - 16}
            houseToSign={houseToSign}
            planetsByHouse={planetsByHouse}
          />
        </View>

        {/* ── Ascendant & Moon Cards ── */}
        <View style={styles.cardsRow}>
          <View style={styles.ascMoonCard}>
            <Text style={styles.ascMoonLabel}>
              {t('kundaliOverview.ascendant').toUpperCase()}
            </Text>
            <Text style={styles.ascMoonValue}>
              {ascData.sign ?? t('kundaliOverview.noData')}
            </Text>
            <Text style={styles.ascMoonSub}>
              {ascData.degree_in_sign ?? ''}
            </Text>
            <Text style={styles.ascMoonSub2}>
              {ascData.nakshatra ?? ''}
              {ascData.nakshatra ? ' • ' : ''}
              {t('kundaliOverview.lord')}:{' '}
              {ascData.sign_lord ?? t('kundaliOverview.noData')}
            </Text>
          </View>
          <View style={styles.ascMoonCard}>
            <Text style={styles.ascMoonLabel}>
              {t('kundaliOverview.moonSign').toUpperCase()}
            </Text>
            <Text style={styles.ascMoonValue}>
              {moonData.sign ?? t('kundaliOverview.noData')}
            </Text>
            <Text style={styles.ascMoonSub}>
              {moonData.degree_in_sign ?? ''}
            </Text>
            <Text style={styles.ascMoonSub2}>
              {moonData.nakshatra ?? ''}
              {moonData.nakshatra ? ' • ' : ''}
              {t('kundaliOverview.lord')}:{' '}
              {moonData.nakshatra_lord ?? t('kundaliOverview.noData')}
            </Text>
          </View>
        </View>

        {/* ── Planetary Positions Table ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('kundaliOverview.planetaryPositions')}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewDetailed}>
              {t('kundaliOverview.viewDetailed')} &gt;
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planetList}>
          {planetRows.map((p, index) => (
            <View
              key={p.enKey}
              style={[
                styles.planetRow,
                index === planetRows.length - 1 && styles.planetRowLast,
              ]}
            >
              <View style={styles.planetIconWrap}>
                <Icon name={p.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.planetTextWrap}>
                {/* label = planet name in API language (en/hi/mr) */}
                <Text style={styles.planetName}>{p.label}</Text>
                <Text style={styles.planetSign}>
                  {p.sign} • {p.deg}
                </Text>
                <Text style={styles.planetNak}>{p.nakshatra}</Text>
              </View>
              <View style={styles.planetRight}>
                <View style={styles.houseBadge}>
                  <Text style={styles.houseBadgeText}>
                    {p.house
                      ? t('kundaliOverview.houseLabel', { num: p.house })
                      : t('kundaliOverview.noData')}
                  </Text>
                </View>
                <Text style={styles.signLordText}>
                  {t('kundaliOverview.lord')}: {p.signLord}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── KP Significators (KP tab) ── */}
        {activeTab === 'kp' && currentKundali && (
          <>
            <Text style={styles.sectionTitleStandalone}>
              {t('kundaliOverview.kpSignificators')}
            </Text>
            <View style={styles.kpTable}>
              <View style={styles.kpTableHeader}>
                <Text style={[styles.kpHeaderCell, { flex: 1.2 }]}>
                  {t('kundaliOverview.planet')}
                </Text>
                <Text style={[styles.kpHeaderCell, { flex: 1 }]}>
                  {t('kundaliOverview.starLord')}
                </Text>
                <Text style={[styles.kpHeaderCell, { flex: 2 }]}>
                  {t('kundaliOverview.houses')}
                </Text>
              </View>
              {kpRows.map(([planetName, data]: [string, any]) => (
                <View key={planetName} style={styles.kpTableRow}>
                  {/* planetName is in API language */}
                  <Text style={[styles.kpCell, { flex: 1.2 }]}>
                    {planetName}
                  </Text>
                  <Text style={[styles.kpCell, { flex: 1 }]}>
                    {data.star_lord ?? '—'}
                  </Text>
                  <Text style={[styles.kpCell, { flex: 2 }]}>
                    {(data.houses ?? []).join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Bhava Significators (Bhav tab) ── */}
        {activeTab === 'bhav' && currentKundali && (
          <>
            <Text style={styles.sectionTitleStandalone}>
              {t('kundaliOverview.bhavaSignificators')}
            </Text>
            <View style={styles.bhavaGrid}>
              {bhavaRows.map(([houseNum, planets]: [string, any]) => {
                const signName = cuspDetails[houseNum]?.sign ?? '';
                const signAbbr = getSignAbbr(signName, lang);
                return (
                  <View key={houseNum} style={styles.bhavaCell}>
                    <Text style={styles.bhavaCellHouse}>
                      {t('kundaliOverview.houseLabel', { num: houseNum })}
                    </Text>
                    <Text style={styles.bhavaCellSign}>{signAbbr || '—'}</Text>
                    <Text style={styles.bhavaCellPlanets}>
                      {/* planets array contains names in API language */}
                      {Array.isArray(planets) && planets.length > 0
                        ? planets.join(', ')
                        : t('kundaliOverview.noData')}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ── Current Dasha ── */}
        <Text style={styles.sectionTitleStandalone}>
          {t('kundaliOverview.currentDasha')}
        </Text>
        <View style={styles.dashaCard}>
          <View style={styles.dashaRow}>
            <View style={styles.dashaIconWrap}>
              <Icon name="clock-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.dashaTextWrap}>
              <Text style={styles.dashaValue}>
                {t('kundaliOverview.dashaValue')}
              </Text>
              <Text style={styles.dashaUntil}>
                {t('kundaliOverview.dashaUntil')}
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '42%' }]} />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {}}
        activeOpacity={0.9}
      >
        <Icon name="head-cog-outline" size={24} color={colors.textOnPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerIconButton: { padding: 4, minWidth: 36 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },

  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: {},
  tabText: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.medium },
  tabTextActive: { color: colors.primary, fontFamily: fonts.bold },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  chartContainer: {
    alignSelf: 'center',
    backgroundColor: CHART_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CHART_COLOR,
    padding: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  ascMoonCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ascMoonLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: fonts.bold,
  },
  ascMoonValue: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 2,
    fontFamily: fonts.bold,
  },
  ascMoonSub: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    marginBottom: 2,
  },
  ascMoonSub2: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  sectionTitleStandalone: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
    marginTop: 8,
  },
  viewDetailed: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.medium,
  },

  planetList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  planetRowLast: { borderBottomWidth: 0 },
  planetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  planetTextWrap: { flex: 1 },
  planetName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  planetSign: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
    fontFamily: fonts.regular,
  },
  planetNak: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 1,
  },
  planetRight: { alignItems: 'flex-end', gap: 4 },
  houseBadge: {
    backgroundColor: colors.logoBackground,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  houseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  signLordText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },

  kpTable: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  kpTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.logoBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kpHeaderCell: { fontSize: 12, color: colors.primary, fontFamily: fonts.bold },
  kpTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kpCell: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },

  bhavaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  bhavaCell: {
    width: '30%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bhavaCellHouse: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  bhavaCellSign: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  bhavaCellPlanets: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },

  dashaCard: {
    backgroundColor: colors.logoBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    marginBottom: 24,
  },
  dashaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dashaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dashaTextWrap: { flex: 1 },
  dashaValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  dashaUntil: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CHART_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
