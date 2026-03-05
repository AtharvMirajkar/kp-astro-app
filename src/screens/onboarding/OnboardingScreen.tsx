import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../components';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type Props = StackScreenProps<OnboardingStackParamList, 'Onboarding'>;

type Slide = {
  id: string;
  title1: string;
  title2: string;
  subtitle: string;
  icon: string;
};

export function OnboardingScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: '1',
      title1: t('onboarding.slide1Title1'),
      title2: t('onboarding.slide1Title2'),
      subtitle: t('onboarding.slide1Subtitle'),
      icon: 'star-four-points',
    },
    {
      id: '2',
      title1: t('onboarding.slide2Title1'),
      title2: t('onboarding.slide2Title2'),
      subtitle: t('onboarding.slide2Subtitle'),
      icon: 'zodiac-gemini',
    },
    {
      id: '3',
      title1: t('onboarding.slide3Title1'),
      title2: t('onboarding.slide3Title2'),
      subtitle: t('onboarding.slide3Subtitle'),
      icon: 'crystal-ball',
    },
  ];

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      navigation.navigate('LanguageSelection');
    }
  };

  const handleSkip = () => {
    navigation.navigate('LanguageSelection');
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <View style={styles.circle}>
          <Icon name={item.icon} size={80} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>
        {item.title1} <Text style={styles.titleHighlight}>{item.title2}</Text>
      </Text>

      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );

  const buttonText =
    currentIndex === slides.length - 1
      ? t('onboarding.getStarted')
      : t('onboarding.next');

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {renderDots()}

      <View style={styles.bottom}>
        <PrimaryButton title={buttonText} onPress={handleNext} />

        <Text style={styles.footerText}>{t('footer.terms')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  skipText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.medium,
  },

  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 40,
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7EFE3',
  },

  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  titleHighlight: {
    color: colors.primary,
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6C8B3',
    marginHorizontal: 5,
  },

  activeDot: {
    width: 28,
    backgroundColor: colors.primary,
  },

  bottom: {
    paddingHorizontal: 24,
    marginTop: 40,
  },

  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
});
