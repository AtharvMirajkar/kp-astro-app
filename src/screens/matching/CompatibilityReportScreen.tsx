import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import type { CompatibilityReportScreenProps } from '../../types/navigation';

const GUNA_ITEMS = [
  { key: 'varna', descKey: 'varnaDesc', score: '1/1', max: 1, icon: 'account-multiple-outline', iconColor: colors.primary },
  { key: 'vashya', descKey: 'vashyaDesc', score: '2/2', max: 2, icon: 'head-heart-outline', iconColor: '#D4A84B' },
  { key: 'tara', descKey: 'taraDesc', score: '1.5/3', max: 3, icon: 'star-outline', iconColor: '#5B7FBD' },
  { key: 'yoni', descKey: 'yoniDesc', score: '4/4', max: 4, icon: 'heart-outline', iconColor: '#D4729A' },
  { key: 'maitri', descKey: 'maitriDesc', score: '5/5', max: 5, icon: 'handshake-outline', iconColor: '#6B9B6B' },
  { key: 'bhakoot', descKey: 'bhakootDesc', score: '7/7', max: 7, icon: 'home-outline', iconColor: '#8B7BB8' },
] as const;

function GunaRow({
  item,
  t,
}: {
  item: (typeof GUNA_ITEMS)[number];
  t: (k: string) => string;
}) {
  const [obtained] = item.score.split('/').map(Number);
  const percent = (obtained / item.max) * 100;
  return (
    <View style={styles.gunaRow}>
      <View style={[styles.gunaIconWrap, { backgroundColor: item.iconColor + '20' }]}>
        <Icon name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={styles.gunaTextWrap}>
        <Text style={styles.gunaName}>{t(`compatibilityReport.${item.key}`)}</Text>
        <Text style={styles.gunaDesc}>{t(`compatibilityReport.${item.descKey}`)}</Text>
        <View style={styles.gunaProgressBg}>
          <View style={[styles.gunaProgressFill, { width: `${percent}%` }]} />
        </View>
      </View>
      <Text style={styles.gunaScore}>{item.score}</Text>
    </View>
  );
}

export function CompatibilityReportScreen({ navigation }: CompatibilityReportScreenProps) {
  const { t } = useTranslation();

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
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('compatibilityReport.screenTitle')}
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="share-variant" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profilesCard}>
          <View style={styles.profileBlock}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80.png' }}
                style={styles.avatar}
              />
              <View style={styles.genderTag}>
                <Text style={styles.genderTagText}>
                  {t('compatibilityReport.maleTag')}
                </Text>
              </View>
            </View>
            <Text style={styles.partnerName}>
              {t('compatibilityReport.partner1Name')}
            </Text>
            <Text style={styles.partnerDob}>
              {t('compatibilityReport.partner1Dob')}
            </Text>
          </View>

          <View style={styles.heartCenter}>
            <Icon name="heart" size={32} color={colors.primary} />
          </View>

          <View style={styles.profileBlock}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80.png' }}
                style={styles.avatar}
              />
              <View style={styles.genderTag}>
                <Text style={styles.genderTagText}>
                  {t('compatibilityReport.femaleTag')}
                </Text>
              </View>
            </View>
            <Text style={styles.partnerName}>
              {t('compatibilityReport.partner2Name')}
            </Text>
            <Text style={styles.partnerDob}>
              {t('compatibilityReport.partner2Dob')}
            </Text>
          </View>
        </View>

        <View style={styles.scoreWrap}>
          <View style={styles.scoreRing}>
            <Text style={styles.scoreValue}>88%</Text>
          </View>
          <Text style={styles.scoreLabel}>
            {t('compatibilityReport.scoreLabel')}
          </Text>
          <Text style={styles.summaryLine}>
            {t('compatibilityReport.summaryLine')}
          </Text>
        </View>

        <View style={styles.gunaSection}>
          <View style={styles.gunaHeader}>
            <Text style={styles.gunaTitle}>
              {t('compatibilityReport.gunaMilanTitle')}
            </Text>
            <TouchableOpacity style={styles.detailedBtn} activeOpacity={0.8}>
              <Text style={styles.detailedBtnText}>
                {t('compatibilityReport.detailedAnalysis')}
              </Text>
            </TouchableOpacity>
          </View>
          {GUNA_ITEMS.map((item) => (
            <GunaRow key={item.key} item={item} t={t} />
          ))}
        </View>

        <View style={styles.verdictCard}>
          <View style={styles.verdictTitleRow}>
            <Icon name="check-circle" size={22} color={colors.textOnPrimary} />
            <Text style={styles.verdictTitle}>
              {t('compatibilityReport.verdictTitle')}
            </Text>
          </View>
          <Text style={styles.verdictBody}>
            {t('compatibilityReport.verdictBody')}
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerIconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profilesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  profileBlock: {
    flex: 1,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  genderTag: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -24,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  genderTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  partnerDob: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  heartCenter: {
    paddingHorizontal: 12,
  },
  scoreWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  summaryLine: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  gunaSection: {
    marginBottom: 20,
  },
  gunaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gunaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailedBtn: {
    backgroundColor: colors.logoBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailedBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  gunaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  gunaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gunaTextWrap: {
    flex: 1,
  },
  gunaName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  gunaDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gunaProgressBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  gunaProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  gunaScore: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  verdictCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  verdictTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verdictTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginLeft: 8,
  },
  verdictBody: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textOnPrimary,
  },
});
