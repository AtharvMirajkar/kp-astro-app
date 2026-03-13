import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

// ─── Category config ────────────────────────────────────────────────────────

type CategoryKey = 'career' | 'marriage' | 'finance' | 'health';

interface Category {
  key: CategoryKey;
  icon: string;
  accentColor: string;
  bgColor: string;
}

const CATEGORIES: Category[] = [
  {
    key: 'career',
    icon: 'briefcase-outline',
    accentColor: '#C9A227',
    bgColor: '#FFF8E7',
  },
  { key: 'marriage', icon: 'ring', accentColor: '#E07A8C', bgColor: '#FFF0F3' },
  {
    key: 'finance',
    icon: 'chart-line',
    accentColor: '#3B82B8',
    bgColor: '#EBF4FF',
  },
  {
    key: 'health',
    icon: 'heart-pulse',
    accentColor: '#3BAA72',
    bgColor: '#EDFBF4',
  },
];

// ─── Period tabs ─────────────────────────────────────────────────────────────

type PeriodKey = 'weekly' | 'monthly' | 'yearly';

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function FuturePredictionsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { currentKundali, birthDetails } = useSelector(
    (state: RootState) => state.kundali,
  );

  const [activePeriod, setActivePeriod] = useState<PeriodKey>('monthly');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('career');

  const ascSign = currentKundali?.planetary_positions?.Ascendant?.sign ?? '—';
  const moonSign = currentKundali?.planetary_positions?.Moon?.sign ?? '—';

  const periods: { key: PeriodKey; label: string }[] = [
    { key: 'weekly', label: t('predictions.periodWeekly') },
    { key: 'monthly', label: t('predictions.periodMonthly') },
    { key: 'yearly', label: t('predictions.periodYearly') },
  ];

  const activeCat = CATEGORIES.find(c => c.key === activeCategory)!;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>
              {t('predictions.headerTitle')}
            </Text>
            <Text style={styles.headerSub}>
              {birthDetails?.name
                ? t('predictions.headerSub', { name: birthDetails.name })
                : t('predictions.headerSubDefault')}
            </Text>
          </View>
          <TouchableOpacity style={styles.headerBadge} activeOpacity={0.8}>
            <Icon
              name="calendar-month-outline"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Dasha banner ── */}
        <View style={styles.dashaBanner}>
          <View style={styles.dashaBannerLeft}>
            <Icon name="clock-fast" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.dashaBannerLabel}>
                {t('predictions.currentDashaLabel')}
              </Text>
              <Text style={styles.dashaBannerValue}>
                {t('predictions.currentDashaValue')}
              </Text>
            </View>
          </View>
          <View style={styles.dashaBannerRight}>
            <Text style={styles.dashaBannerAsc}>{ascSign}</Text>
            <Text style={styles.dashaBannerSignLabel}>Lagna</Text>
          </View>
        </View>

        {/* ── Period Selector ── */}
        <View style={styles.periodRow}>
          {periods.map(p => (
            <Pressable
              key={p.key}
              style={[
                styles.periodChip,
                activePeriod === p.key && styles.periodChipActive,
              ]}
              onPress={() => setActivePeriod(p.key)}
            >
              <Text
                style={[
                  styles.periodChipText,
                  activePeriod === p.key && styles.periodChipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Category Cards (2×2 grid) ── */}
        <Text style={styles.sectionTitle}>
          {t('predictions.categoriesTitle')}
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryCard,
                { backgroundColor: cat.bgColor },
                activeCategory === cat.key && styles.categoryCardActive,
                activeCategory === cat.key && {
                  borderColor: cat.accentColor,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => setActiveCategory(cat.key)}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  { backgroundColor: cat.accentColor + '22' },
                ]}
              >
                <Icon name={cat.icon} size={22} color={cat.accentColor} />
              </View>
              <Text style={[styles.categoryTitle, { color: cat.accentColor }]}>
                {t(`predictions.category_${cat.key}`)}
              </Text>
              <Text style={styles.categoryScore}>
                {t(`predictions.score_${cat.key}_${activePeriod}`)}
              </Text>
              <View style={styles.scoreBarTrack}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      backgroundColor: cat.accentColor,
                      width: SCORE_WIDTHS[cat.key][activePeriod],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Active Category Detail ── */}
        <View
          style={[
            styles.detailCard,
            { borderLeftColor: activeCat.accentColor },
          ]}
        >
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIconWrap,
                { backgroundColor: activeCat.bgColor },
              ]}
            >
              <Icon
                name={activeCat.icon}
                size={20}
                color={activeCat.accentColor}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.detailTitle}>
                {t(`predictions.category_${activeCategory}`)}
                {' · '}
                {t(`predictions.period_${activePeriod}_label`)}
              </Text>
              <Text
                style={[styles.detailScore, { color: activeCat.accentColor }]}
              >
                {t(`predictions.scoreLabel_${activeCategory}_${activePeriod}`)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.detailCta,
                { backgroundColor: activeCat.accentColor },
              ]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate(`${capitalize(activeCategory)}Prediction`)
              }
            >
              <Text style={styles.detailCtaText}>
                {t('predictions.detailCta')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.detailBody}>
            {t(`predictions.detail_${activeCategory}_${activePeriod}`)}
          </Text>

          {/* Key Points */}
          <View style={styles.keyPointsList}>
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.keyPointRow}>
                <View
                  style={[
                    styles.keyPointDot,
                    { backgroundColor: activeCat.accentColor },
                  ]}
                />
                <Text style={styles.keyPointText}>
                  {t(
                    `predictions.point_${activeCategory}_${activePeriod}_${i}`,
                  )}
                </Text>
              </View>
            ))}
          </View>

          {/* Favorable dates */}
          <View style={styles.favorableDatesRow}>
            <Icon name="star-outline" size={14} color={activeCat.accentColor} />
            <Text style={styles.favorableDatesText}>
              {t('predictions.favorableDates')}:{' '}
              <Text
                style={{
                  color: activeCat.accentColor,
                  fontFamily: fonts.medium,
                }}
              >
                {t(`predictions.dates_${activeCategory}_${activePeriod}`)}
              </Text>
            </Text>
          </View>
        </View>

        {/* ── Planetary Influences ── */}
        <Text style={styles.sectionTitle}>
          {t('predictions.planetaryInfluences')}
        </Text>
        <View style={styles.influenceList}>
          {PLANETARY_INFLUENCES.map((item, i) => (
            <View
              key={item.planet}
              style={[
                styles.influenceRow,
                i === PLANETARY_INFLUENCES.length - 1 &&
                  styles.influenceRowLast,
              ]}
            >
              <View
                style={[styles.influenceDot, { backgroundColor: item.color }]}
              />
              <View style={styles.influenceText}>
                <Text style={styles.influencePlanet}>{item.planet}</Text>
                <Text style={styles.influenceDesc}>
                  {t(`predictions.influence_${item.key}`)}
                </Text>
              </View>
              <View
                style={[
                  styles.influenceImpactPill,
                  { backgroundColor: item.color + '22' },
                ]}
              >
                <Text
                  style={[styles.influenceImpactText, { color: item.color }]}
                >
                  {t(`predictions.impact_${item.key}`)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Remedies ── */}
        <Text style={styles.sectionTitle}>
          {t('predictions.remediesTitle')}
        </Text>
        <View style={styles.remediesCard}>
          {REMEDIES.map((remedy, i) => (
            <View key={i} style={styles.remedyRow}>
              <View style={styles.remedyIconWrap}>
                <Icon name={remedy.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.remedyText}>
                {t(`predictions.remedy_${i}`)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Static data ─────────────────────────────────────────────────────────────

const SCORE_WIDTHS: Record<CategoryKey, Record<PeriodKey, DimensionValue>> = {
  career: { weekly: '72%', monthly: '65%', yearly: '80%' },
  marriage: { weekly: '58%', monthly: '74%', yearly: '68%' },
  finance: { weekly: '45%', monthly: '60%', yearly: '75%' },
  health: { weekly: '82%', monthly: '70%', yearly: '78%' },
};

const PLANETARY_INFLUENCES = [
  { planet: 'Jupiter', key: 'jupiter', color: '#C9A227' },
  { planet: 'Saturn', key: 'saturn', color: '#5B6BA8' },
  { planet: 'Venus', key: 'venus', color: '#E07A8C' },
  { planet: 'Rahu', key: 'rahu', color: '#6B4E8E' },
];

const REMEDIES = [
  { icon: 'candle' },
  { icon: 'leaf' },
  { icon: 'meditation' },
  { icon: 'food-apple-outline' },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Dasha banner
  dashaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.logoBackground,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    marginBottom: 16,
  },
  dashaBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashaBannerLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  dashaBannerValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginTop: 1,
  },
  dashaBannerRight: {
    alignItems: 'flex-end',
  },
  dashaBannerAsc: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  dashaBannerSignLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  // Period selector
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },
  periodChipTextActive: {
    color: colors.textOnPrimary,
    fontFamily: fonts.bold,
  },

  // Section title
  sectionTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    borderWidth: 1.5,
  },
  categoryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  categoryScore: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 8,
  },
  scoreBarTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Detail card
  detailCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  detailScore: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  detailCta: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailCtaText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: fonts.bold,
  },
  detailBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: fonts.regular,
    marginBottom: 14,
  },
  keyPointsList: {
    gap: 8,
    marginBottom: 12,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  keyPointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  keyPointText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  favorableDatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  favorableDatesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  // Planetary influences
  influenceList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 24,
  },
  influenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  influenceRowLast: {
    borderBottomWidth: 0,
  },
  influenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  influenceText: {
    flex: 1,
  },
  influencePlanet: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  influenceDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 1,
  },
  influenceImpactPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  influenceImpactText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },

  // Remedies
  remediesCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  remedyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  remedyIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    lineHeight: 19,
  },
});
