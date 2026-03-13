import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WeekEnergyLevel = 'high' | 'peak' | 'moderate' | 'rising';

export interface WeekCardData {
  week: string;
  dateRange: string;
  energy: string;
  highlight: string;
  doThis: string;
  avoidThis: string;
}

export interface WeekCardProps {
  item: WeekCardData;
  /** i18n namespace prefix for energy/doThis/avoidThis keys e.g. 'careerPrediction' */
  i18nPrefix: string;
  /** Override the peak energy accent color — defaults to #C9A227 */
  accentColor?: string;
}

// ─── Energy color map ─────────────────────────────────────────────────────────

const ENERGY_COLORS: Record<WeekEnergyLevel, string> = {
  high: '#3BAA72',
  peak: '#C9A227',
  moderate: '#3B82B8',
  rising: '#8E4E9E',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WeekCard({ item, i18nPrefix, accentColor }: WeekCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const energy = item.energy as WeekEnergyLevel;
  const energyColor =
    accentColor && energy === 'peak'
      ? accentColor
      : ENERGY_COLORS[energy] ?? '#C9A227';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => setExpanded(e => !e)}
    >
      {/* ── Row: week label + energy pill + chevron ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: energyColor }]} />
          <View>
            <Text style={styles.weekLabel}>{item.week}</Text>
            <Text style={styles.dateRange}>{item.dateRange}</Text>
          </View>
        </View>
        <View
          style={[styles.energyPill, { backgroundColor: energyColor + '22' }]}
        >
          <Text style={[styles.energyText, { color: energyColor }]}>
            {t(`${i18nPrefix}.energy_${energy}`)}
          </Text>
        </View>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
          style={styles.chevron}
        />
      </View>

      {/* ── Highlight ── */}
      <Text style={styles.highlight} numberOfLines={expanded ? undefined : 2}>
        {item.highlight}
      </Text>

      {/* ── Expanded: do / avoid ── */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.tipRow}>
            <View style={[styles.tipIcon, styles.tipIconGood]}>
              <Icon name="check-circle-outline" size={16} color="#3BAA72" />
            </View>
            <View style={styles.tipTextWrap}>
              <Text style={styles.tipLabel}>{t(`${i18nPrefix}.doThis`)}</Text>
              <Text style={styles.tipText}>{item.doThis}</Text>
            </View>
          </View>

          <View style={styles.tipRow}>
            <View style={[styles.tipIcon, styles.tipIconBad]}>
              <Icon name="close-circle-outline" size={16} color="#E07A5F" />
            </View>
            <View style={styles.tipTextWrap}>
              <Text style={styles.tipLabel}>
                {t(`${i18nPrefix}.avoidThis`)}
              </Text>
              <Text style={styles.tipText}>{item.avoidThis}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  weekLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  dateRange: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 1,
  },
  energyPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  energyText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  chevron: {
    marginLeft: 6,
  },
  highlight: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 19,
  },
  expandedContent: {
    marginTop: 12,
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipIconGood: { backgroundColor: '#E8F7F0' },
  tipIconBad: { backgroundColor: '#FDECEA' },
  tipTextWrap: { flex: 1 },
  tipLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },
});
