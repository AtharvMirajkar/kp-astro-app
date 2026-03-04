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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import type { KundaliOverviewScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';

const CHART_COLOR = '#C9A227';
const CHART_BG = '#FDFBF7';

// Simplified 12-house grid: 3 rows x 4 cols. Each cell shows planet codes.
const CHART_CELLS: string[][] = [
  ['Ma', 'Mo', 'Su', 'Ma'],
  ['Mo', 'Ke', 'Me', 'Ju'],
  ['Ve', 'Sa', 'Ra', 'Su'],
];

export function KundaliOverviewScreen({
  navigation,
  route,
}: KundaliOverviewScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'rashi' | 'bhav' | 'kp' | 'd9'>(
    'rashi',
  );
  const name = route.params?.name ?? 'Arjun Sharma';
  const birthDetail =
    route.params?.dob && route.params?.tob
      ? `${route.params.dob}, ${route.params.tob}`
      : t('kundaliOverview.birthSubtitle');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${name} - ${t(
          'kundaliOverview.screenTitle',
        )} • ${birthDetail}`,
        title: t('kundaliOverview.screenTitle'),
      });
    } catch (_) {}
  };

  const tabs = [
    { key: 'rashi' as const, label: t('kundaliOverview.tabRashi') },
    { key: 'bhav' as const, label: t('kundaliOverview.tabBhav') },
    { key: 'kp' as const, label: t('kundaliOverview.tabKP') },
    { key: 'd9' as const, label: t('kundaliOverview.tabD9') },
  ];

  const planets = [
    {
      key: 'sun',
      label: t('kundaliOverview.sun'),
      sign: 'Virgo',
      deg: "12° 45' 12''",
      direct: true,
      house: 11,
    },
    {
      key: 'moon',
      label: t('kundaliOverview.moon'),
      sign: 'Aries',
      deg: "05° 22' 08''",
      direct: true,
      house: 6,
    },
    {
      key: 'mars',
      label: t('kundaliOverview.mars'),
      sign: 'Gemini',
      deg: "28° 10' 44''",
      direct: false,
      house: 8,
    },
    {
      key: 'mercury',
      label: t('kundaliOverview.mercury'),
      sign: 'Virgo',
      deg: "02° 11' 00''",
      direct: true,
      house: 11,
    },
    {
      key: 'jupiter',
      label: t('kundaliOverview.jupiter'),
      sign: 'Leo',
      deg: "15° 30' 55''",
      direct: true,
      house: 10,
    },
    {
      key: 'venus',
      label: t('kundaliOverview.venus'),
      sign: 'Libra',
      deg: "18° 44' 22''",
      direct: true,
      house: 12,
    },
    {
      key: 'saturn',
      label: t('kundaliOverview.saturn'),
      sign: 'Capricorn',
      deg: "22° 05' 33''",
      direct: false,
      house: 3,
    },
  ];

  const chartSize = Dimensions.get('window').width - 48;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View
          style={[
            styles.chartContainer,
            { width: chartSize, height: chartSize },
          ]}
        >
          <View style={styles.chartInner}>
            {CHART_CELLS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.chartRow}>
                {row.map((cell, colIndex) => (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={styles.chartCell}
                  >
                    <Text style={styles.chartCellText}>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.ascMoonCard}>
            <Text style={styles.ascMoonLabel}>
              {t('kundaliOverview.ascendant').toUpperCase()}
            </Text>
            <Text style={styles.ascMoonValue}>
              {t('kundaliOverview.ascendantValue')}
            </Text>
            <Text style={styles.ascMoonSub}>
              {t('kundaliOverview.ascendantLord')}
            </Text>
          </View>
          <View style={styles.ascMoonCard}>
            <Text style={styles.ascMoonLabel}>
              {t('kundaliOverview.moonSign').toUpperCase()}
            </Text>
            <Text style={styles.ascMoonValue}>
              {t('kundaliOverview.moonSignValue')}
            </Text>
            <Text style={styles.ascMoonSub}>
              {t('kundaliOverview.moonSignNakshatra')}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('kundaliOverview.planetaryPositions')}
          </Text>
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <Text style={styles.viewDetailed}>
              {t('kundaliOverview.viewDetailed')} &gt;
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planetList}>
          {planets.map((p, index) => (
            <View
              key={p.key}
              style={[
                styles.planetRow,
                index === planets.length - 1 && styles.planetRowLast,
              ]}
            >
              <View style={styles.planetIconWrap}>
                <Icon
                  name={
                    p.key === 'sun'
                      ? 'white-balance-sunny'
                      : p.key === 'moon'
                      ? 'moon-waning-crescent'
                      : p.key === 'mars'
                      ? 'circle-small'
                      : p.key === 'jupiter'
                      ? 'star'
                      : 'circle-outline'
                  }
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              <View style={styles.planetTextWrap}>
                <Text style={styles.planetName}>{p.label}</Text>
                <Text style={styles.planetSign}>
                  {p.sign} • {p.deg}
                </Text>
              </View>
              <View
                style={[styles.statusPill, !p.direct && styles.statusPillRetro]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    !p.direct && styles.statusPillTextRetro,
                  ]}
                >
                  {p.direct
                    ? t('kundaliOverview.direct')
                    : t('kundaliOverview.retro')}
                </Text>
              </View>
              <Text style={styles.houseLabel}>H-{p.house}</Text>
            </View>
          ))}
        </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconButton: {
    padding: 4,
    minWidth: 36,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {},
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
    fontFamily: fonts.bold,
  },
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
  },
  chartInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: CHART_COLOR,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartRow: {
    flex: 1,
    flexDirection: 'row',
  },
  chartCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: CHART_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  chartCellLastCol: {
    borderRightWidth: 0,
  },
  chartCellLastRow: {
    borderBottomWidth: 0,
  },
  chartCellText: {
    fontSize: 11,
    fontWeight: '600',
    color: CHART_COLOR,
    fontFamily: fonts.medium,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
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
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: fonts.bold,
  },
  ascMoonValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
    fontFamily: fonts.bold,
  },
  ascMoonSub: {
    fontSize: 12,
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
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  sectionTitleStandalone: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },
  viewDetailed: {
    fontSize: 13,
    fontWeight: '600',
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
  planetRowLast: {
    borderBottomWidth: 0,
  },
  planetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  planetTextWrap: {
    flex: 1,
  },
  planetName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  planetSign: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  statusPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusPillRetro: {
    backgroundColor: '#FFEBEE',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: fonts.medium,
  },
  statusPillTextRetro: {
    color: '#C62828',
  },
  houseLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  dashaCard: {
    backgroundColor: colors.logoBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },
  dashaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dashaTextWrap: {
    flex: 1,
  },
  dashaValue: {
    fontSize: 15,
    fontWeight: '700',
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
