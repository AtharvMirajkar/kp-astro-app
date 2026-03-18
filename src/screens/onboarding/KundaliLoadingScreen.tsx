import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../constants/colors';
import { fonts } from '../../constants';
import { RootState, AppDispatch } from '../../redux/store';
import { generateKundali } from '../../redux/slices/kundaliSlice';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────

const ZODIAC_RING = [
  { icon: 'zodiac-aries', label: 'Aries' },
  { icon: 'zodiac-taurus', label: 'Taurus' },
  { icon: 'zodiac-gemini', label: 'Gemini' },
  { icon: 'zodiac-cancer', label: 'Cancer' },
  { icon: 'zodiac-leo', label: 'Leo' },
  { icon: 'zodiac-virgo', label: 'Virgo' },
  { icon: 'zodiac-libra', label: 'Libra' },
  { icon: 'zodiac-scorpio', label: 'Scorpio' },
  { icon: 'zodiac-sagittarius', label: 'Sagittarius' },
  { icon: 'zodiac-capricorn', label: 'Capricorn' },
  { icon: 'zodiac-aquarius', label: 'Aquarius' },
  { icon: 'zodiac-pisces', label: 'Pisces' },
];

const LOADING_STEPS = [
  { icon: 'map-marker-star', text: 'Reading your birth coordinates...' },
  { icon: 'orbit', text: 'Calculating planetary positions...' },
  { icon: 'chart-bubble', text: 'Analysing house cusps...' },
  { icon: 'star-four-points', text: 'Computing nakshatra positions...' },
  { icon: 'timeline-clock-outline', text: 'Aligning your Dasha periods...' },
  { icon: 'creation', text: 'Generating your Kundali...' },
];

const RING_RADIUS = 118;
const RING_ICON_COUNT = ZODIAC_RING.length;

// ─── Screen ───────────────────────────────────────────────────────────────────

export function KundaliLoadingScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { birthDetails, loading } = useSelector((s: RootState) => s.kundali);

  // ── Animation refs ──
  const ringRotate = useRef(new Animated.Value(0)).current;
  const counterRotate = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const stepFadeAnim = useRef(new Animated.Value(1)).current;

  // ── Step state ──
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Ring rotation (clockwise) ──
  useEffect(() => {
    Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [ringRotate]);

  // ── Counter-rotation so icons stay upright ──
  useEffect(() => {
    Animated.loop(
      Animated.timing(counterRotate, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [counterRotate]);

  // ── Centre pulse ──
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseScale]);

  // ── Glow pulse ──
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.9,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glowOpacity]);

  // ── Progress bar ──
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: LOADING_STEPS.length * 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progressWidth]);

  // ── Step cycling with crossfade ──
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Fade out
      Animated.timing(stepFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setStepIndex(prev =>
          prev < LOADING_STEPS.length - 1 ? prev + 1 : prev,
        );
        // Fade in
        Animated.timing(stepFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stepFadeAnim]);

  // ── API call ──
  useEffect(() => {
    const generate = async () => {
      if (!birthDetails) return;
      try {
        const result = await dispatch(generateKundali(birthDetails));
        if (generateKundali.fulfilled.match(result)) {
          navigation.replace('MainTabs');
        } else {
          Alert.alert('Error', 'Failed to generate Kundali. Please try again.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Kundali generation failed', error);
        Alert.alert(
          'Error',
          'Something went wrong while generating your Kundali.',
        );
        navigation.goBack();
      }
    };
    generate();
  }, [birthDetails, dispatch, navigation]);

  // ── Interpolations ──
  const ringDeg = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const counterDeg = counterRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const barWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const currentStep = LOADING_STEPS[stepIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Top label ── */}
        <View style={styles.topLabel}>
          <Icon name="creation" size={14} color={colors.primary} />
          <Text style={styles.topLabelText}>
            {birthDetails?.name
              ? `Casting chart for ${birthDetails.name}`
              : 'Casting your birth chart'}
          </Text>
        </View>

        {/* ── Mandala / Ring area ── */}
        <View style={styles.mandalaWrap}>
          {/* Outer glow */}
          <Animated.View style={[styles.outerGlow, { opacity: glowOpacity }]} />

          {/* Rotating zodiac ring */}
          <Animated.View
            style={[styles.zodiacRing, { transform: [{ rotate: ringDeg }] }]}
          >
            {ZODIAC_RING.map((z, i) => {
              const angle = (i / RING_ICON_COUNT) * 2 * Math.PI;
              const x = RING_RADIUS * Math.cos(angle - Math.PI / 2);
              const y = RING_RADIUS * Math.sin(angle - Math.PI / 2);
              return (
                <Animated.View
                  key={z.icon}
                  style={[
                    styles.zodiacIconWrap,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: counterDeg }, // keep icons upright
                      ],
                    },
                  ]}
                >
                  <Icon
                    name={z.icon}
                    size={18}
                    color={colors.primary}
                    style={{ opacity: 0.75 }}
                  />
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Static decorative ring border */}
          <View style={styles.ringBorder} />

          {/* Inner dotted ring */}
          <View style={styles.innerRingBorder} />

          {/* Pulsing centre circle */}
          <Animated.View
            style={[
              styles.centreCircle,
              { transform: [{ scale: pulseScale }] },
            ]}
          >
            <Icon name="star-david" size={44} color={colors.primary} />
          </Animated.View>
        </View>

        {/* ── Title ── */}
        <Text style={styles.title}>Generating Your Kundali</Text>
        <Text style={styles.subtitle}>
          Reading the stars at your moment of birth
        </Text>

        {/* ── Step indicator ── */}
        <Animated.View style={[styles.stepRow, { opacity: stepFadeAnim }]}>
          <View style={[styles.stepIconWrap]}>
            <Icon name={currentStep.icon} size={16} color={colors.primary} />
          </View>
          <Text style={styles.stepText}>{currentStep.text}</Text>
        </Animated.View>

        {/* ── Progress bar ── */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: barWidth as any }]}
          />
          {/* Shimmer dot at progress front */}
          <Animated.View
            style={[styles.progressDot, { left: barWidth as any }]}
          />
        </View>

        {/* ── Step counter ── */}
        <Text style={styles.stepCounter}>
          {stepIndex + 1} of {LOADING_STEPS.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const MANDALA_SIZE = width * 0.78;
const CENTER_SIZE = 96;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  // Top pill label
  topLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.logoBackground,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 44,
  },
  topLabelText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.medium,
    letterSpacing: 0.3,
  },

  // Mandala container
  mandalaWrap: {
    width: MANDALA_SIZE,
    height: MANDALA_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 44,
  },

  // Outer animated glow halo
  outerGlow: {
    position: 'absolute',
    width: MANDALA_SIZE,
    height: MANDALA_SIZE,
    borderRadius: MANDALA_SIZE / 2,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },

  // Static ring border
  ringBorder: {
    position: 'absolute',
    width: MANDALA_SIZE - 20,
    height: MANDALA_SIZE - 20,
    borderRadius: (MANDALA_SIZE - 20) / 2,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    borderStyle: 'dashed',
  },

  // Inner decorative ring
  innerRingBorder: {
    position: 'absolute',
    width: MANDALA_SIZE * 0.52,
    height: MANDALA_SIZE * 0.52,
    borderRadius: (MANDALA_SIZE * 0.52) / 2,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },

  // Rotating zodiac ring overlay
  zodiacRing: {
    position: 'absolute',
    width: MANDALA_SIZE,
    height: MANDALA_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Each zodiac icon positioned around the ring
  zodiacIconWrap: {
    position: 'absolute',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.logoBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.logoBorder,
  },

  // Pulsing centre
  centreCircle: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: colors.logoBackground,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  // Title & subtitle
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: 0.2,
  },

  // Step row
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    minHeight: 26,
  },
  stepIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.logoBackground,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },

  // Progress bar
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.logoBackground,
    borderRadius: 2,
    overflow: 'visible',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: -6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },

  // Step counter
  stepCounter: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
