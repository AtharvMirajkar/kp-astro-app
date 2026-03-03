import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

export function HomeScreen() {
  const { t } = useTranslation();

  const userName = 'Rahul';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Icon name="menu" size={24} color={colors.textPrimary} />
          <Text style={styles.headerTitle}>{t('home.headerTitle')}</Text>
          <View style={styles.headerRight}>
            <Icon name="bell-outline" size={22} color={colors.textPrimary} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              {/* Placeholder avatar */}
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80.png' }}
                style={styles.avatarImage}
              />
              <View style={styles.statusDot} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.greeting}>
                {t('home.greeting', { name: userName })}
              </Text>
              <Text style={styles.dateLine}>{t('home.dateLine')}</Text>
              <View style={styles.auspiciousRow}>
                <Icon name="star-outline" size={14} color={colors.primary} />
                <Text style={styles.auspiciousText}>
                  {t('home.auspiciousTag')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('home.natalSummaryTitle')}</Text>
          <Text style={styles.sectionLink}>{t('home.viewChart')}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardLeft]}>
            <View style={styles.summaryIconWrapper}>
              <Icon name="human-male" size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryLabel}>{t('home.ascendantTitle')}</Text>
            <Text style={styles.summaryValue}>{t('home.ascendantSign')}</Text>
            <Text style={styles.summarySub}>{t('home.ascendantSub')}</Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardRight]}>
            <View style={styles.summaryIconWrapper}>
              <Icon
                name="moon-waning-crescent"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.summaryLabel}>{t('home.moonSignTitle')}</Text>
            <Text style={styles.summaryValue}>{t('home.moonSignSign')}</Text>
            <Text style={styles.summarySub}>{t('home.moonSignSub')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('home.currentPeriodsTitle')}</Text>

        <View style={styles.periodCard}>
          <View style={styles.periodIconWrapperJupiter}>
            <Text style={styles.periodIconText}>Ju</Text>
          </View>
          <View style={styles.periodTextWrapper}>
            <Text style={styles.periodTitle}>{t('home.jupiterTitle')}</Text>
            <Text style={styles.periodSub}>{t('home.jupiterSub')}</Text>
          </View>
        </View>

        <View style={styles.periodCard}>
          <View style={styles.periodIconWrapperSaturn}>
            <Icon name="orbit-variant" size={20} color={colors.primary} />
          </View>
          <View style={styles.periodTextWrapper}>
            <Text style={styles.periodTitle}>{t('home.saturnTitle')}</Text>
            <Text style={styles.periodSub}>{t('home.saturnSub')}</Text>
          </View>
          <View style={styles.periodTag}>
            <Text style={styles.periodTagText}>{t('home.retrograde')}</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>{t('home.insightTitle')}</Text>
          <Text style={styles.insightBody}>{t('home.insightBody')}</Text>
          <View style={styles.insightButton}>
            <Text style={styles.insightButtonText}>{t('home.insightCta')}</Text>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dateLine: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  auspiciousRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auspiciousText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  summaryCardLeft: {
    marginRight: 4,
  },
  summaryCardRight: {
    marginLeft: 4,
  },
  summaryIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
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
  periodIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  periodTextWrapper: {
    flex: 1,
  },
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
  insightCard: {
    marginTop: 16,
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
