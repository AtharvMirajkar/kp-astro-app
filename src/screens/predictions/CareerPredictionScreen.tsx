import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import { ScoreRing, WeekCard, PredictionSectionTitle } from '../../components';

// ─── Static data ──────────────────────────────────────────────────────────────
// TODO: replace with API call → fetchCareerPrediction(userId, period)
import CAREER_DATA from '../../data/careerPredictionData.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanetStrength = 'strong' | 'moderate' | 'watch';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#C9A227';
const ACCENT_BG = '#FFF8E7';
const ACCENT_LIGHT = '#FFF3D6';

const STRENGTH_COLORS: Record<PlanetStrength, string> = {
  strong: '#3BAA72',
  moderate: '#C9A227',
  watch: '#E07A5F',
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CareerPredictionScreen({ navigation }: any) {
  const { t } = useTranslation();
  const data = CAREER_DATA;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${data.meta.generatedFor} – Career Prediction (${data.meta.periodRange})\nScore: ${data.meta.score}/100 · ${data.meta.scoreLabel}\n\n${data.summary}`,
        title: t('careerPrediction.screenTitle'),
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
          <Text style={styles.headerTitle}>
            {t('careerPrediction.screenTitle')}
          </Text>
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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Score Hero ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroScoreLabel}>
              {t('careerPrediction.scoreLabel')}
            </Text>
            <Text style={styles.heroScoreValue}>{data.meta.scoreLabel}</Text>
            <View style={styles.heroTrendRow}>
              <Icon
                name={
                  data.overallOutlook.trend === 'upward'
                    ? 'trending-up'
                    : data.overallOutlook.trend === 'downward'
                    ? 'trending-down'
                    : 'trending-neutral'
                }
                size={16}
                color={
                  data.overallOutlook.trend === 'upward' ? '#3BAA72' : ACCENT
                }
              />
              <Text style={styles.heroTrendText}>
                {t(`careerPrediction.trend_${data.overallOutlook.trend}`)}
              </Text>
            </View>
            <Text style={styles.heroUpdated}>
              {t('careerPrediction.lastUpdated')}: {data.meta.lastUpdated}
            </Text>
          </View>
          <ScoreRing score={data.meta.score} />
        </View>

        {/* ── Summary ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="text-box-outline" size={16} color={ACCENT} />
            <Text style={styles.summaryTitle}>
              {t('careerPrediction.summaryTitle')}
            </Text>
          </View>
          <Text style={styles.summaryBody}>{data.summary}</Text>
        </View>

        {/* ── Key Themes ── */}
        <PredictionSectionTitle label={t('careerPrediction.keyThemesTitle')} />
        <View style={styles.themesList}>
          {data.keyThemes.map(theme => (
            <View key={theme.id} style={styles.themeCard}>
              <View style={styles.themeIconWrap}>
                <Icon name={theme.icon} size={22} color={ACCENT} />
              </View>
              <Text style={styles.themeTitle}>{theme.title}</Text>
              <Text style={styles.themeDesc}>{theme.description}</Text>
            </View>
          ))}
        </View>

        {/* ── Weekly Breakdown ── */}
        <PredictionSectionTitle
          label={t('careerPrediction.weeklyBreakdownTitle')}
        />
        {data.weeklyBreakdown.map(week => (
          <WeekCard key={week.week} item={week} i18nPrefix="careerPrediction" />
        ))}

        {/* ── Planetary Factors ── */}
        <PredictionSectionTitle
          label={t('careerPrediction.planetaryFactorsTitle')}
        />
        <View style={styles.planetList}>
          {data.planetaryFactors.map((planet, i) => {
            const strength = planet.strength as PlanetStrength;
            return (
              <View
                key={planet.planet}
                style={[
                  styles.planetRow,
                  i === data.planetaryFactors.length - 1 &&
                    styles.planetRowLast,
                ]}
              >
                <View
                  style={[styles.planetDot, { backgroundColor: planet.color }]}
                />
                <View style={styles.planetContent}>
                  <View style={styles.planetTopRow}>
                    <Text style={styles.planetName}>{planet.planet}</Text>
                    <View
                      style={[
                        styles.strengthPill,
                        { backgroundColor: STRENGTH_COLORS[strength] + '22' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.strengthText,
                          { color: STRENGTH_COLORS[strength] },
                        ]}
                      >
                        {t(`careerPrediction.strength_${strength}`)}
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

        {/* ── Favorable / Challenging Dates ── */}
        <PredictionSectionTitle
          label={t('careerPrediction.favorableDatesTitle')}
        />
        <View style={styles.datesCard}>
          <View style={styles.datesSectionHeader}>
            <Icon name="star-circle" size={16} color="#3BAA72" />
            <Text style={[styles.datesSectionTitle, { color: '#3BAA72' }]}>
              {t('careerPrediction.favorableDatesTitle')}
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
              {t('careerPrediction.challengingDatesTitle')}
            </Text>
          </View>
          <View style={styles.datePillsRow}>
            {data.challengingDates.map(d => (
              <View key={d} style={styles.datePillBad}>
                <Text style={styles.datePillBadText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Remedies ── */}
        <PredictionSectionTitle label={t('careerPrediction.remediesTitle')} />
        <View style={styles.remediesList}>
          {data.remedies.map((remedy, i) => (
            <View
              key={remedy.id}
              style={[
                styles.remedyRow,
                i === data.remedies.length - 1 && styles.remedyRowLast,
              ]}
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
        <PredictionSectionTitle
          label={t('careerPrediction.astrologyBasisTitle')}
        />
        <View style={styles.basisCard}>
          {[
            {
              label: t('careerPrediction.ascendant'),
              value: data.astrologyBasis.ascendant,
            },
            {
              label: t('careerPrediction.currentDasha'),
              value: data.astrologyBasis.currentDasha,
            },
            {
              label: t('careerPrediction.transitHighlight'),
              value: data.astrologyBasis.transitHighlight,
            },
            {
              label: t('careerPrediction.moonSign'),
              value: data.astrologyBasis.moonSign,
            },
            {
              label: t('careerPrediction.keyHouses'),
              value: data.astrologyBasis.keyHouses.join(' · '),
            },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[
                styles.basisRow,
                i === arr.length - 1 && styles.basisRowLast,
              ]}
            >
              <Text style={styles.basisLabel}>{row.label}</Text>
              <Text style={styles.basisValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── CTAs ── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Icon
              name="share-variant"
              size={16}
              color={ACCENT}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.ctaSecondaryText}>
              {t('careerPrediction.shareReport')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaPrimary}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <Icon
              name="phone-outline"
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.ctaPrimaryText}>
              {t('careerPrediction.bookConsultation')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBtn: { padding: 4, minWidth: 36 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 1,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ACCENT_BG,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ACCENT + '44',
  },
  heroLeft: { flex: 1, marginRight: 16 },
  heroScoreLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroScoreValue: {
    fontSize: 26,
    color: ACCENT,
    fontFamily: fonts.bold,
    marginBottom: 6,
  },
  heroTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  heroTrendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },
  heroUpdated: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  summaryCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 13,
    color: ACCENT,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryBody: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 21,
  },
  themesList: { gap: 10, marginBottom: 20 },
  themeCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: ACCENT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  themeTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  themeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  planetList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planetRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  planetRowLast: { borderBottomWidth: 0 },
  planetDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  planetContent: { flex: 1 },
  planetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  planetName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  strengthPill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  strengthText: { fontSize: 11, fontFamily: fonts.bold },
  planetRole: {
    fontSize: 11,
    color: ACCENT,
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  planetEffect: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },
  datesCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  datesSectionTitle: { fontSize: 13, fontFamily: fonts.bold },
  datePillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  datePillGood: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F7F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3BAA7244',
  },
  datePillGoodText: { fontSize: 13, color: '#3BAA72', fontFamily: fonts.bold },
  datePillBad: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E07A5F44',
  },
  datePillBadText: { fontSize: 13, color: '#E07A5F', fontFamily: fonts.bold },
  datesDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  remediesList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  remedyRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
    alignItems: 'flex-start',
  },
  remedyRowLast: { borderBottomWidth: 0 },
  remedyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ACCENT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyContent: { flex: 1 },
  remedyTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  remedyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 19,
  },
  basisCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  basisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  basisRowLast: { borderBottomWidth: 0 },
  basisLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    flex: 1,
  },
  basisValue: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    flex: 2,
    textAlign: 'right',
  },
  ctaRow: { flexDirection: 'row', gap: 10 },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: ACCENT_BG,
  },
  ctaSecondaryText: { fontSize: 14, color: ACCENT, fontFamily: fonts.bold },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: ACCENT,
  },
  ctaPrimaryText: { fontSize: 14, color: '#fff', fontFamily: fonts.bold },
});
