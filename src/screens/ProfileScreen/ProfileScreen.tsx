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
import type { ProfileScreenProps } from '../../types/navigation';
import { fonts } from '../../constants';

export function ProfileScreen({ navigation }: ProfileScreenProps) {
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
            <Icon name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.headerTitle')}</Text>
          <TouchableOpacity
            onPress={() => {}}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.headerIconButton}
          >
            <Icon name="cog-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x120.png' }}
              style={styles.avatarImage}
            />
            <View style={styles.avatarBadge}>
              <Icon name="star" size={16} color={colors.textOnPrimary} />
            </View>
          </View>

          <Text style={styles.profileName}>{t('profile.name')}</Text>
          <View style={styles.profileMetaRow}>
            <View style={styles.tierPill}>
              <Text style={styles.tierPillText}>{t('profile.tierLabel')}</Text>
            </View>
            <Text style={styles.memberSinceText}>
              {t('profile.memberSince')}
            </Text>
          </View>

          <View style={styles.profileButtonsRow}>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
              <Icon
                name="pencil-outline"
                size={16}
                color={colors.textOnPrimary}
                style={styles.editButtonIcon}
              />
              <Text style={styles.editButtonText}>
                {t('profile.editProfile')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} activeOpacity={0.85}>
              <Icon
                name="share-variant"
                size={16}
                color={colors.textPrimary}
                style={styles.shareButtonIcon}
              />
              <Text style={styles.shareButtonText}>
                {t('profile.shareChart')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {t('profile.savedChartsValue')}
            </Text>
            <Text style={styles.statLabel}>
              {t('profile.savedChartsLabel')}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('profile.reportsValue')}</Text>
            <Text style={styles.statLabel}>{t('profile.reportsLabel')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('profile.minutesValue')}</Text>
            <Text style={styles.statLabel}>{t('profile.minutesLabel')}</Text>
          </View>
        </View>

        <View style={styles.zodiacCard}>
          <Text style={styles.zodiacTitle}>{t('profile.zodiacTitle')}</Text>
          <View style={styles.zodiacRow}>
            <View style={styles.zodiacItem}>
              <Icon
                name="white-balance-sunny"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.zodiacLabel}>{t('profile.sunLabel')}</Text>
              <Text style={styles.zodiacValue}>{t('profile.sunValue')}</Text>
            </View>
            <View style={styles.zodiacItem}>
              <Icon
                name="moon-waxing-crescent"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.zodiacLabel}>{t('profile.moonLabel')}</Text>
              <Text style={styles.zodiacValue}>{t('profile.moonValue')}</Text>
            </View>
            <View style={styles.zodiacItem}>
              <Icon name="human-male" size={20} color={colors.primary} />
              <Text style={styles.zodiacLabel}>{t('profile.ascLabel')}</Text>
              <Text style={styles.zodiacValue}>{t('profile.ascValue')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.servicesTitle}>{t('profile.servicesTitle')}</Text>

        <View style={styles.serviceCard}>
          <View style={styles.serviceLeft}>
            <View style={styles.serviceIconWrapper}>
              <Icon
                name="file-document-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.serviceTitle}>
                {t('profile.prashnaTitle')}
              </Text>
              <Text style={styles.serviceSubtitle}>
                {t('profile.prashnaSubtitle')}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.serviceCard}>
          <View style={styles.serviceLeft}>
            <View style={styles.serviceIconWrapper}>
              <Icon name="wallet-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.serviceTitle}>
                {t('profile.walletTitle')}
              </Text>
              <Text style={styles.serviceSubtitle}>
                {t('profile.walletSubtitle')}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.serviceCard}>
          <View style={styles.serviceLeft}>
            <View style={styles.serviceIconWrapper}>
              <Icon name="history" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.serviceTitle}>
                {t('profile.historyTitle')}
              </Text>
              <Text style={styles.serviceSubtitle}>
                {t('profile.historySubtitle')}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
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
    marginBottom: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  profileName: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tierPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFE9BF',
    marginRight: 8,
  },
  tierPillText: {
    fontSize: 11,
    color: colors.primary,
    textTransform: 'uppercase',
    fontFamily: fonts.medium,
  },
  memberSinceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  profileButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    marginRight: 6,
  },
  editButtonIcon: {
    marginRight: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.textOnPrimary,
    fontFamily: fonts.medium,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 10,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButtonIcon: {
    marginRight: 6,
  },
  shareButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  zodiacCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  zodiacTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: fonts.bold,
  },
  zodiacRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zodiacItem: {
    flex: 1,
    alignItems: 'center',
  },
  zodiacLabel: {
    marginTop: 6,
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  zodiacValue: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
  },
  servicesTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: fonts.bold,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
});
