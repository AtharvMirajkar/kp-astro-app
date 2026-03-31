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
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import type { CompatibilityReportScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';
import { RootState } from '../../redux/store';

// ─── Grade → color map ────────────────────────────────────────────────────────
// Grade values come from API in selected language — map by percentage instead

function gradeColor(percentage: number): string {
  if (percentage >= 75) return '#3BAA72';
  if (percentage >= 50) return '#C9A227';
  return '#E07A5F';
}

// ─── Koota row component ──────────────────────────────────────────────────────

function KootaRow({ item }: { item: any }) {
  const percent = (item.scored / item.max_points) * 100;
  const dotColor = item.compatible ? '#3BAA72' : '#E07A5F';
  const scoreColor = item.compatible ? '#3BAA72' : '#E07A5F';

  return (
    <View style={styles.kootaRow}>
      {/* Compatible indicator dot */}
      <View style={[styles.kootaDot, { backgroundColor: dotColor }]} />

      <View style={styles.kootaContent}>
        {/* Koot name — comes from API in selected language */}
        <View style={styles.kootaTopRow}>
          <Text style={styles.kootaName}>{item.koot}</Text>
          <Text style={[styles.kootaScore, { color: scoreColor }]}>
            {item.scored}/{item.max_points}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.kootaBarTrack}>
          <View
            style={[
              styles.kootaBarFill,
              {
                backgroundColor: dotColor,
                width: `${percent}%` as DimensionValue,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Mangal Dosha card ────────────────────────────────────────────────────────

function MangalDoshaCard({
  label,
  data,
}: {
  label: string;
  data: { mars_house: number; has_mangal_dosha: boolean; description: string };
}) {
  const hasDosh = data.has_mangal_dosha;
  return (
    <View
      style={[
        styles.mangalCard,
        { borderLeftColor: hasDosh ? '#E07A5F' : '#3BAA72' },
      ]}
    >
      <View style={styles.mangalTopRow}>
        <Icon
          name={hasDosh ? 'alert-circle-outline' : 'shield-check-outline'}
          size={18}
          color={hasDosh ? '#E07A5F' : '#3BAA72'}
        />
        <Text style={styles.mangalLabel}>{label}</Text>
        <View
          style={[
            styles.mangalPill,
            { backgroundColor: hasDosh ? '#FDECEA' : '#E8F7F0' },
          ]}
        >
          <Text
            style={[
              styles.mangalPillText,
              { color: hasDosh ? '#E07A5F' : '#3BAA72' },
            ]}
          >
            {/* description from API — already in selected language */}
            {hasDosh ? '⚠' : '✓'}
          </Text>
        </View>
      </View>
      <Text style={styles.mangalDesc}>{data.description}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function CompatibilityReportScreen({
  navigation,
}: CompatibilityReportScreenProps) {
  const { t } = useTranslation();
  const { result, loading } = useSelector((s: RootState) => s.matching);

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `${result._boyName} & ${
          result._girlName
        } — Compatibility: ${result.compatibility.percentage.toFixed(1)}% (${
          result.compatibility.grade
        })\n${result.compatibility.recommendation}`,
        title: t('compatibilityReport.screenTitle'),
      });
    } catch (_) {}
  };

  // Fallback while loading or no data
  if (loading || !result) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centerWrap}>
          <Text style={styles.emptyText}>
            {loading
              ? t('matching.calculating')
              : t('compatibilityReport.noData')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    boy,
    girl,
    kootas,
    total_scored,
    max_points,
    compatibility,
    mangal_dosha,
  } = result;
  const percentage = compatibility.percentage;
  const ringColor = gradeColor(percentage);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('compatibilityReport.screenTitle')}
          </Text>
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="share-variant" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Partner profiles ── */}
        <View style={styles.profilesCard}>
          {/* Boy */}
          <View style={styles.profileBlock}>
            <View
              style={[
                styles.avatarIconContainer,
                { backgroundColor: '#E3F2FD' },
              ]}
            >
              <Icon name="account-circle" size={64} color="#1976D2" />
            </View>
            <View style={styles.genderTag}>
              <Text style={styles.genderTagText}>
                {t('compatibilityReport.maleTag')}
              </Text>
            </View>
            <Text style={styles.partnerName}>{result._boyName}</Text>
            {/* Nakshatra + rashi from API — already in selected language */}
            <Text style={styles.partnerSub}>{boy.nakshatra}</Text>
            <Text style={styles.partnerSub}>{boy.rashi}</Text>
          </View>

          <View style={styles.heartCenter}>
            <Icon name="heart" size={32} color={colors.primary} />
          </View>

          {/* Girl */}
          <View style={styles.profileBlock}>
            <View
              style={[
                styles.avatarIconContainer,
                { backgroundColor: '#FCE4EC' },
              ]}
            >
              <Icon name="account-circle" size={64} color="#C2185B" />
            </View>
            <View style={[styles.genderTag, { backgroundColor: '#C2185B' }]}>
              <Text style={styles.genderTagText}>
                {t('compatibilityReport.femaleTag')}
              </Text>
            </View>
            <Text style={styles.partnerName}>{result._girlName}</Text>
            <Text style={styles.partnerSub}>{girl.nakshatra}</Text>
            <Text style={styles.partnerSub}>{girl.rashi}</Text>
          </View>
        </View>

        {/* ── Score ring ── */}
        <View style={styles.scoreWrap}>
          <View style={[styles.scoreRing, { borderColor: ringColor }]}>
            <Text style={[styles.scoreValue, { color: ringColor }]}>
              {percentage.toFixed(0)}%
            </Text>
          </View>
          {/* Grade from API — already in selected language */}
          <Text style={[styles.scoreGrade, { color: ringColor }]}>
            {compatibility.grade}
          </Text>
          <Text style={styles.scoreFraction}>
            {total_scored} / {max_points} {t('compatibilityReport.points')}
          </Text>
          {/* Recommendation from API — already in selected language */}
          <Text style={styles.recommendation}>
            {compatibility.recommendation}
          </Text>
        </View>

        {/* ── Koota Milan ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {t('compatibilityReport.gunaMilanTitle')}
          </Text>
          <Text style={styles.kootaCount}>
            {kootas.filter(k => k.compatible).length}/{kootas.length}{' '}
            {t('compatibilityReport.compatible')}
          </Text>
        </View>

        <View style={styles.kootaList}>
          {kootas.map((item, i) => (
            <View
              key={i}
              style={[
                styles.kootaRowWrap,
                i === kootas.length - 1 && styles.kootaRowLast,
              ]}
            >
              <KootaRow item={item} />
            </View>
          ))}
        </View>

        {/* ── Nakshatra details ── */}
        <Text style={styles.sectionTitle}>
          {t('compatibilityReport.nakshatraTitle')}
        </Text>
        <View style={styles.nakshatraCard}>
          {[
            { label: result._boyName, data: boy },
            { label: result._girlName, data: girl },
          ].map(({ label, data }, i) => (
            <View
              key={label}
              style={[
                styles.nakshatraRow,
                i === 0 && styles.nakshatraRowBorder,
              ]}
            >
              <Text style={styles.nakshatraName}>{label}</Text>
              <View style={styles.nakshatraDetails}>
                <View style={styles.nakshatraChip}>
                  <Text style={styles.nakshatraChipLabel}>
                    {t('compatibilityReport.nakshatra')}
                  </Text>
                  {/* From API — selected language */}
                  <Text style={styles.nakshatraChipValue}>
                    {data.nakshatra}
                  </Text>
                </View>
                <View style={styles.nakshatraChip}>
                  <Text style={styles.nakshatraChipLabel}>
                    {t('compatibilityReport.rashi')}
                  </Text>
                  <Text style={styles.nakshatraChipValue}>{data.rashi}</Text>
                </View>
                <View style={styles.nakshatraChip}>
                  <Text style={styles.nakshatraChipLabel}>
                    {t('compatibilityReport.lord')}
                  </Text>
                  <Text style={styles.nakshatraChipValue}>
                    {data.rashi_lord}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Mangal Dosha ── */}
        <Text style={styles.sectionTitle}>
          {t('compatibilityReport.mangalDoshaTitle')}
        </Text>
        <MangalDoshaCard label={result._boyName} data={mangal_dosha.boy} />
        <MangalDoshaCard label={result._girlName} data={mangal_dosha.girl} />

        {/* Cancellation note from API — already in selected language */}
        {mangal_dosha.cancellation_note ? (
          <View style={styles.cancellationNote}>
            <Icon name="information-outline" size={16} color={colors.primary} />
            <Text style={styles.cancellationText}>
              {mangal_dosha.cancellation_note}
            </Text>
          </View>
        ) : null}

        {/* ── Verdict card ── */}
        <View style={[styles.verdictCard, { backgroundColor: ringColor }]}>
          <View style={styles.verdictTitleRow}>
            <Icon
              name={percentage >= 50 ? 'check-circle' : 'alert-circle'}
              size={22}
              color={colors.textOnPrimary}
            />
            <Text style={styles.verdictTitle}>
              {t('compatibilityReport.verdictTitle')}
            </Text>
          </View>
          {/* Grade + recommendation from API — selected language */}
          <Text style={styles.verdictBody}>{compatibility.recommendation}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centerWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

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
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

  // Profiles
  profilesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  profileBlock: { flex: 1, alignItems: 'center' },
  avatarIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  genderTag: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    marginLeft: -24,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  genderTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textOnPrimary,
    fontFamily: fonts.bold,
  },
  partnerName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  partnerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  heartCenter: { paddingHorizontal: 12 },

  // Score
  scoreWrap: { alignItems: 'center', marginBottom: 28 },
  scoreRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: { fontSize: 28, fontFamily: fonts.bold },
  scoreGrade: { fontSize: 18, fontFamily: fonts.bold, marginBottom: 4 },
  scoreFraction: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  // Section header
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  kootaCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },

  // Koota list
  kootaList: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kootaRowWrap: { borderBottomWidth: 1, borderBottomColor: colors.border },
  kootaRowLast: { borderBottomWidth: 0 },
  kootaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  kootaDot: { width: 8, height: 8, borderRadius: 4 },
  kootaContent: { flex: 1 },
  kootaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kootaName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  kootaScore: { fontSize: 13, fontFamily: fonts.bold },
  kootaBarTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  kootaBarFill: { height: '100%', borderRadius: 2 },

  // Nakshatra
  nakshatraCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nakshatraRow: { padding: 14 },
  nakshatraRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nakshatraName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  nakshatraDetails: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  nakshatraChip: {
    backgroundColor: colors.logoBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  nakshatraChipLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: 2,
  },
  nakshatraChipValue: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bold,
  },

  // Mangal dosha
  mangalCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mangalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  mangalLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  mangalPill: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  mangalPillText: { fontSize: 12, fontFamily: fonts.bold },
  mangalDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },

  cancellationNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.logoBackground,
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  cancellationText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },

  // Verdict
  verdictCard: { borderRadius: 16, padding: 18, marginBottom: 8 },
  verdictTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  verdictTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textOnPrimary,
    marginLeft: 8,
  },
  verdictBody: { fontSize: 14, lineHeight: 22, color: colors.textOnPrimary },
});
