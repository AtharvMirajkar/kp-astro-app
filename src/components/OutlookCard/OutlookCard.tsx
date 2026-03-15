import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OutlookTrend = 'upward' | 'downward' | 'stable';

export interface OutlookCardProps {
  /** MaterialCommunityIcons icon name */
  icon: string;
  iconColor: string;
  iconBg: string;
  /** Full i18n key e.g. 'financePrediction.incomeOutlookTitle' */
  titleKey: string;
  score: number;
  trend: OutlookTrend;
  /** Body text shown when expanded — API-supplied, not translated */
  insight: string;
  /** i18n namespace prefix for trend labels e.g. 'financePrediction' */
  i18nPrefix: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TREND_ICONS: Record<OutlookTrend, string> = {
  upward: 'trending-up',
  downward: 'trending-down',
  stable: 'trending-neutral',
};

const TREND_COLORS: Record<OutlookTrend, string> = {
  upward: '#3BAA72',
  downward: '#E07A5F',
  stable: '#C9A227',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OutlookCard({
  icon,
  iconColor,
  iconBg,
  titleKey,
  score,
  trend,
  insight,
  i18nPrefix,
}: OutlookCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const trendColor = TREND_COLORS[trend];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => setExpanded(e => !e)}
    >
      {/* ── Top row: icon · title · trend · score · chevron ── */}
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>

        <View style={styles.mid}>
          <Text style={styles.title}>{t(titleKey)}</Text>
          <View style={styles.trendRow}>
            <Icon name={TREND_ICONS[trend]} size={13} color={trendColor} />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {t(`${i18nPrefix}.outlookTrend_${trend}`)}
            </Text>
          </View>
        </View>

        <View style={styles.scoreWrap}>
          <Text style={[styles.score, { color: iconColor }]}>{score}</Text>
          <Text style={styles.scoreOut}>/100</Text>
        </View>

        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
          style={styles.chevron}
        />
      </View>

      {/* ── Score bar ── */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: iconColor,
              width: `${score}%` as DimensionValue,
            },
          ]}
        />
      </View>

      {/* ── Expanded insight ── */}
      {expanded && <Text style={styles.insight}>{insight}</Text>}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mid: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontFamily: fonts.medium,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
    marginRight: 4,
  },
  score: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  scoreOut: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  chevron: {
    marginLeft: 6,
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  insight: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    lineHeight: 20,
    marginTop: 12,
  },
});
