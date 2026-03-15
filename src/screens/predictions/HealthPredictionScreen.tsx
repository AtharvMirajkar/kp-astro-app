import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import {
  ScoreRing,
  WeekCard,
  PredictionSectionTitle,
} from '../../components';

// ─── Static data ──────────────────────────────────────────────────────────────
// TODO: replace with API call → fetchHealthPrediction(userId, period)
import HEALTH_DATA from '../../data/healthPredictionData.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanetStrength = 'strong' | 'moderate' | 'watch';
type RiskLevel      = 'low' | 'moderate' | 'watch';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT       = '#3BAA72';
const ACCENT_BG    = '#EBF7F1';
const ACCENT_LIGHT = '#D4F0E3';

const STRENGTH_COLORS: Record<PlanetStrength, string> = {
  strong:   '#3BAA72',
  moderate: '#C9A227',
  watch:    '#E07A5F',
};

const RISK_COLORS: Record<RiskLevel, string> = {
  low:      '#3BAA72',
  moderate: '#C9A227',
  watch:    '#E07A5F',
};

const RISK_ICONS: Record<RiskLevel, string> = {
  low:      'shield-check-outline',
  moderate: 'alert-outline',
  watch:    'alert-circle-outline',
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HealthPredictionScreen({ navigation }: any) {
  const { t } = useTranslation();
  const data = HEALTH_DATA;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${data.meta.generatedFor} – Health Prediction (${data.meta.periodRange})\nScore: ${data.meta.score}/100 · ${data.meta.scoreLabel}\n\n${data.summary}`,
        title: t('healthPrediction.screenTitle'),
      });
    } catch (_) {}
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
          <Text style={styles.headerTitle}>{t('healthPrediction.screenTitle')}</Text>
          <Text style={styles.headerSub}>
            {data.meta.generatedFor} · {data.meta.periodRange}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
        >
          <Icon name="share-variant" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Score Hero ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroScoreLabel}>{t('healthPrediction.scoreLabel')}</Text>
            <Text style={styles.heroScoreValue}>{data.meta.scoreLabel}</Text>
            <View style={styles.heroTrendRow}>
              <Icon
                name={
                  data.overallOutlook.trend === 'upward' ? 'trending-up'
                  : data.overallOutlook.trend === 'downward' ? 'trending-down'
                  : 'trending-neutral'
                }
                size={16}
                color={
                  data.overallOutlook.trend === 'upward' ? '#3BAA72'
                  : data.overallOutlook.trend === 'downward' ? '#E07A5F'
                  : '#C9A227'
                }
              />
              <Text style={styles.heroTrendText}>
                {t(`healthPrediction.trend_${data.overallOutlook.trend}`)}
              </Text>
            </View>
            <Text style={styles.heroUpdated}>
              {t('healthPrediction.lastUpdated')}: {data.meta.lastUpdated}
            </Text>
          </View>
          <ScoreRing score={data.meta.score} />
        </View>

        {/* ── Summary ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="heart-pulse" size={16} color={ACCENT} />
            <Text style={styles.summaryTitle}>{t('healthPrediction.summaryTitle')}</Text>
          </View>
          <Text style={styles.summaryBody}>{data.summary}</Text>
        </View>

        {/* ── Health Zones (2×2 grid) ── */}
        <PredictionSectionTitle label={t('healthPrediction.healthZonesTitle')} />
        <View style={styles.zonesGrid}>
          {data.healthZones.map(zone => (
            <View key={zone.id} style={styles.zoneCard}>
              <View style={[styles.zoneIconWrap, { backgroundColor: zone.color + '22' }]}>
                <Icon name={zone.icon} size={22} color={zone.color} />
              </View>
              <Text style={styles.zoneName}>{zone.zone}</Text>
              <Text style={styles.zoneDesc}>{zone.description}</Text>
              <View style={styles.zoneScoreRow}>
                <Text style={[styles.zoneScore, { color: zone.color }]}>{zone.score}</Text>
                <Text style={styles.zoneScoreOut}>/100</Text>
              </View>
              <View style={styles.zoneBarTrack}>
                <View
                  style={[
                    styles.zoneBarFill,
                    {
                      backgroundColor: zone.color,
                      width: `${zone.score}%` as DimensionValue,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* ── Body Areas to Watch ── */}
        <PredictionSectionTitle label={t('healthPrediction.bodyAreasTitle')} />
        <View style={styles.bodyAreasList}>
          {data.bodyAreas.map((area, i) => {
            const risk = area.riskLevel as RiskLevel;
            const riskColor = RISK_COLORS[risk];
            return (
              <View
                key={area.id}
                style={[
                  styles.bodyAreaRow,
                  i === data.bodyAreas.length - 1 && styles.bodyAreaRowLast,
                ]}
              >
                <View style={[styles.bodyAreaIconWrap, { backgroundColor: riskColor + '22' }]}>
                  <Icon name={RISK_ICONS[risk]} size={18} color={riskColor} />
                </View>
                <View style={styles.bodyAreaContent}>
                  <View style={styles.bodyAreaTopRow}>
                    <Text style={styles.bodyAreaName}>{area.area}</Text>
                    <View style={[styles.riskPill, { backgroundColor: riskColor + '22' }]}>
                      <Text style={[styles.riskText, { color: riskColor }]}>
                        {t(`healthPrediction.riskLevel_${risk}`)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.bodyAreaNote}>{area.note}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Key Themes ── */}
        <PredictionSectionTitle label={t('healthPrediction.keyThemesTitle')} />
        <View style={styles.themesList}>
          {data.keyThemes.map(theme => (
            <View key={theme.id} style={styles.themeCard}>
              <View style={styles.themeIconWrap}>
                <Icon name={theme.icon} size={22} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.themeTitle}>{theme.title}</Text>
                <Text style={styles.themeDesc}>{theme.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Weekly Breakdown ── */}
        <PredictionSectionTitle label={t('healthPrediction.weeklyBreakdownTitle')} />
        {data.weeklyBreakdown.map(week => (
          <WeekCard
            key={week.week}
            item={week}
            i18nPrefix="healthPrediction"
            accentColor={ACCENT}
          />
        ))}

        {/* ── Wellness Tips ── */}
        <PredictionSectionTitle label={t('healthPrediction.wellnessTipsTitle')} />
        <View style={styles.tipsList}>
          {data.wellnessTips.map((tip, i) => (
            <View
              key={tip.id}
              style={[styles.tipRow, i === data.wellnessTips.length - 1 && styles.tipRowLast]}
            >
              <View style={[styles.tipIconWrap, { backgroundColor: tip.color + '22' }]}>
                <Icon name={tip.icon} size={20} color={tip.color} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipCategory, { color: tip.color }]}>{tip.category}</Text>
                <Text style={styles.tipText}>{tip.tip}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Planetary Factors ── */}
        <PredictionSectionTitle label={t('healthPrediction.planetaryFactorsTitle')} />
        <View style={styles.planetList}>
          {data.planetaryFactors.map((planet, i) => {
            const strength = planet.strength as PlanetStrength;
            return (
              <View
                key={planet.planet}
                style={[styles.planetRow, i === data.planetaryFactors.length - 1 && styles.planetRowLast]}
              >
                <View style={[styles.planetDot, { backgroundColor: planet.color }]} />
                <View style={styles.planetContent}>
                  <View style={styles.planetTopRow}>
                    <Text style={styles.planetName}>{planet.planet}</Text>
                    <View style={[styles.strengthPill, { backgroundColor: STRENGTH_COLORS[strength] + '22' }]}>
                      <Text style={[styles.strengthText, { color: STRENGTH_COLORS[strength] }]}>
                        {t(`healthPrediction.strength_${strength}`)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.planetRole}>{planet.role}</Text>
                  <Text style={styles.planetEffect}>{planet.effect}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Favourable / Avoid Dates ── */}
        <PredictionSectionTitle label={t('healthPrediction.favorableDatesTitle')} />
        <View style={styles.datesCard}>
          <View style={styles.datesSectionHeader}>
            <Icon name="star-circle" size={16} color={ACCENT} />
            <Text style={[styles.datesSectionTitle, { color: ACCENT }]}>
              {t('healthPrediction.favorableDatesTitle')}
            </Text>
          </View>
          <View style={styles.datePillsRow}>
            {data.favorableDates.map(d => (
              <View key={d} style={styles.datePillGood}>
                <Text style={styles.datePillGoodText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.datesDivider} />

          <View style={styles.datesSectionHeader}>
            <Icon name="alert-circle-outline" size={16} color="#E07A5F" />
            <Text style={[styles.datesSectionTitle, { color: '#E07A5F' }]}>
              {t('healthPrediction.avoidDatesTitle')}
            </Text>
          </View>
          <View style={styles.datePillsRow}>
            {data.avoidDates.map(d => (
              <View key={d} style={styles.datePillBad}>
                <Text style={styles.datePillBadText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Remedies ── */}
        <PredictionSectionTitle label={t('healthPrediction.remediesTitle')} />
        <View style={styles.remediesList}>
          {data.remedies.map((remedy, i) => (
            <View
              key={remedy.id}
              style={[styles.remedyRow, i === data.remedies.length - 1 && styles.remedyRowLast]}
            >
              <View style={styles.remedyIconWrap}>
                <Icon name={remedy.icon} size={20} color={ACCENT} />
              </View>
              <View style={styles.remedyContent}>
                <Text style={styles.remedyTitle}>{remedy.title}</Text>
                <Text style={styles.remedyDesc}>{remedy.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Astrology Basis ── */}
        <PredictionSectionTitle label={t('healthPrediction.astrologyBasisTitle')} />
        <View style={styles.basisCard}>
          {[
            { label: t('healthPrediction.ascendant'),        value: data.astrologyBasis.ascendant },
            { label: t('healthPrediction.currentDasha'),     value: data.astrologyBasis.currentDasha },
            { label: t('healthPrediction.transitHighlight'), value: data.astrologyBasis.transitHighlight },
            { label: t('healthPrediction.moonSign'),         value: data.astrologyBasis.moonSign },
            { label: t('healthPrediction.keyHouses'),        value: data.astrologyBasis.keyHouses.join(' · ') },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.basisRow, i === arr.length - 1 && styles.basisRowLast]}>
              <Text style={styles.basisLabel}>{row.label}</Text>
              <Text style={styles.basisValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── CTAs ── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaSecondary} onPress={handleShare} activeOpacity={0.85}>
            <Icon name="share-variant" size={16} color={ACCENT} style={{ marginRight: 6 }} />
            <Text style={styles.ctaSecondaryText}>{t('healthPrediction.shareReport')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaPrimary} activeOpacity={0.85} onPress={() => {}}>
            <Icon name="phone-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.ctaPrimaryText}>{t('healthPrediction.bookConsultation')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerBtn:    { padding: 4, minWidth: 36 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 17, color: colors.textPrimary, fontFamily: fonts.bold },
  headerSub:    { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.regular, marginTop: 1 },

  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },

  // Hero
  heroCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: ACCENT_BG, borderRadius: 18, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: ACCENT + '44',
  },
  heroLeft:       { flex: 1, marginRight: 16 },
  heroScoreLabel: { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.regular, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  heroScoreValue: { fontSize: 26, color: ACCENT, fontFamily: fonts.bold, marginBottom: 6 },
  heroTrendRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  heroTrendText:  { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.medium },
  heroUpdated:    { fontSize: 11, color: colors.textMuted, fontFamily: fonts.regular },

  // Summary
  summaryCard: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14, padding: 14,
    marginBottom: 20, borderLeftWidth: 3, borderLeftColor: ACCENT,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  summaryTitle:  { fontSize: 13, color: ACCENT, fontFamily: fonts.bold, textTransform: 'uppercase', letterSpacing: 0.4 },
  summaryBody:   { fontSize: 13, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 21 },

  // Health Zones grid
  zonesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  zoneCard: {
    width: '47.5%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  zoneIconWrap:  { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  zoneName:      { fontSize: 13, color: colors.textPrimary, fontFamily: fonts.bold, marginBottom: 4 },
  zoneDesc:      { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 16, marginBottom: 8, minHeight: 32 },
  zoneScoreRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 1, marginBottom: 6 },
  zoneScore:     { fontSize: 18, fontFamily: fonts.bold },
  zoneScoreOut:  { fontSize: 10, color: colors.textSecondary, fontFamily: fonts.regular },
  zoneBarTrack:  { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  zoneBarFill:   { height: '100%', borderRadius: 2 },

  // Body Areas
  bodyAreasList: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  bodyAreaRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12,
  },
  bodyAreaRowLast:  { borderBottomWidth: 0 },
  bodyAreaIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  bodyAreaContent:  { flex: 1 },
  bodyAreaTopRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bodyAreaName:     { fontSize: 13, color: colors.textPrimary, fontFamily: fonts.bold },
  riskPill:         { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  riskText:         { fontSize: 10, fontFamily: fonts.bold },
  bodyAreaNote:     { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 18 },

  // Key Themes
  themesList: { gap: 10, marginBottom: 20 },
  themeCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: colors.backgroundSecondary, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start',
  },
  themeIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: ACCENT_LIGHT, justifyContent: 'center', alignItems: 'center' },
  themeTitle:    { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.bold, marginBottom: 4 },
  themeDesc:     { fontSize: 13, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 19 },

  // Wellness Tips
  tipsList: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  tipRow:      { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  tipRowLast:  { borderBottomWidth: 0 },
  tipIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tipContent:  { flex: 1 },
  tipCategory: { fontSize: 12, fontFamily: fonts.bold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  tipText:     { fontSize: 13, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 19 },

  // Planetary
  planetList: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  planetRow:     { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  planetRowLast: { borderBottomWidth: 0 },
  planetDot:     { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  planetContent: { flex: 1 },
  planetTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  planetName:    { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.bold },
  strengthPill:  { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  strengthText:  { fontSize: 11, fontFamily: fonts.bold },
  planetRole:    { fontSize: 11, color: ACCENT, fontFamily: fonts.medium, marginBottom: 4 },
  planetEffect:  { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 18 },

  // Dates
  datesCard: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  datesSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  datesSectionTitle:  { fontSize: 13, fontFamily: fonts.bold },
  datePillsRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  datePillGood:     { width: 36, height: 36, borderRadius: 18, backgroundColor: ACCENT_LIGHT, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: ACCENT + '55' },
  datePillGoodText: { fontSize: 13, color: ACCENT, fontFamily: fonts.bold },
  datePillBad:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FDECEA', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E07A5F44' },
  datePillBadText:  { fontSize: 13, color: '#E07A5F', fontFamily: fonts.bold },
  datesDivider:     { height: 1, backgroundColor: colors.border, marginVertical: 12 },

  // Remedies
  remediesList: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  remedyRow:      { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12, alignItems: 'flex-start' },
  remedyRowLast:  { borderBottomWidth: 0 },
  remedyIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: ACCENT_LIGHT, justifyContent: 'center', alignItems: 'center' },
  remedyContent:  { flex: 1 },
  remedyTitle:    { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.bold, marginBottom: 4 },
  remedyDesc:     { fontSize: 13, color: colors.textSecondary, fontFamily: fonts.regular, lineHeight: 19 },

  // Basis
  basisCard: {
    backgroundColor: colors.backgroundSecondary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  basisRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  basisRowLast: { borderBottomWidth: 0 },
  basisLabel:   { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.medium, flex: 1 },
  basisValue:   { fontSize: 12, color: colors.textPrimary, fontFamily: fonts.bold, flex: 2, textAlign: 'right' },

  // CTAs
  ctaRow:           { flexDirection: 'row', gap: 10 },
  ctaSecondary:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: ACCENT, backgroundColor: ACCENT_BG },
  ctaSecondaryText: { fontSize: 14, color: ACCENT, fontFamily: fonts.bold },
  ctaPrimary:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: ACCENT },
  ctaPrimaryText:   { fontSize: 14, color: '#fff', fontFamily: fonts.bold },
});
