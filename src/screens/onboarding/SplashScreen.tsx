import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

const { width, height } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#C9A227'; // gold
const PRIMARY_BG = '#1A1608'; // deep warm dark — gives a luxurious astrology feel
const RING_SIZE = width * 0.62;

// Zodiac signs arranged around the ring
const ZODIAC_ICONS = [
  'zodiac-aries',
  'zodiac-taurus',
  'zodiac-gemini',
  'zodiac-cancer',
  'zodiac-leo',
  'zodiac-virgo',
  'zodiac-libra',
  'zodiac-scorpio',
  'zodiac-sagittarius',
  'zodiac-capricorn',
  'zodiac-aquarius',
  'zodiac-pisces',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SplashScreenProps {
  onFinish: () => void; // called when animation is done — trigger navigation
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SplashScreen({ onFinish }: SplashScreenProps) {
  // ── Animation values ──────────────────────────────────────────────────────
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(16)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(12)).current;

  const dotsOpacity = useRef(new Animated.Value(0)).current;

  const screenOpacity = useRef(new Animated.Value(1)).current; // for final fade-out

  // ── Sequence ──────────────────────────────────────────────────────────────
  useEffect(() => {
    StatusBar.setHidden(true);

    // 1. Ring fades + scales in while starting to rotate
    Animated.parallel([
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(ringScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 14000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();

    // 2. Logo pops in after 300ms
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Logo glow pulse (looping)
    Animated.sequence([
      Animated.delay(700),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoGlow, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoGlow, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    // 4. App name slides up after 700ms
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 5. Tagline slides up after 1000ms
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 6. Loading dots fade in after 1200ms
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 7. Fade the whole screen out after 2800ms → call onFinish
    Animated.sequence([
      Animated.delay(2800),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      StatusBar.setHidden(false);
      onFinish();
    });
  }, []);

  // ── Derived interpolations ────────────────────────────────────────────────
  const ringDeg = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.55],
  });

  const glowScale = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* ── Subtle radial background glow ── */}
      <View style={styles.bgGlow} />

      {/* ── Mandala / Ring ── */}
      <Animated.View
        style={[
          styles.ringWrap,
          {
            opacity: ringOpacity,
            transform: [{ scale: ringScale }, { rotate: ringDeg }],
          },
        ]}
      >
        {ZODIAC_ICONS.map((icon, i) => {
          const angle = (i / ZODIAC_ICONS.length) * 2 * Math.PI;
          const r = RING_SIZE / 2 - 20;
          const x = r * Math.cos(angle - Math.PI / 2);
          const y = r * Math.sin(angle - Math.PI / 2);
          return (
            <Animated.View
              key={icon}
              style={[
                styles.zodiacIconWrap,
                {
                  transform: [
                    { translateX: x },
                    { translateY: y },
                    // counter-rotate so icons stay upright
                    {
                      rotate: ringRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Icon
                name={icon}
                size={16}
                color={PRIMARY}
                style={{ opacity: 0.7 }}
              />
            </Animated.View>
          );
        })}

        {/* Dashed ring border */}
        <View style={styles.ringBorder} />
      </Animated.View>

      {/* ── Logo glow halo ── */}
      <Animated.View
        style={[
          styles.logoGlow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* ── Centre logo ── */}
      <Animated.View
        style={[
          styles.logoCircle,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Icon name="star-david" size={52} color={PRIMARY} />
      </Animated.View>

      {/* ── App name ── */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        KP Jyotish
      </Animated.Text>

      {/* ── Tagline ── */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineTranslateY }],
          },
        ]}
      >
        Ancient wisdom. Precise predictions.
      </Animated.Text>

      {/* ── Loading dots ── */}
      <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map(i => (
          <LoadingDot key={i} delay={i * 180} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Loading dot sub-component ────────────────────────────────────────────────

function LoadingDot({ delay }: { delay: number }) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounce, {
          toValue: -6,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.dot, { transform: [{ translateY: bounce }] }]}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Warm radial glow behind everything
  bgGlow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: PRIMARY,
    opacity: 0.04,
    top: height * 0.5 - width * 0.6,
  },

  // Rotating zodiac ring
  ringWrap: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBorder: {
    position: 'absolute',
    width: RING_SIZE - 4,
    height: RING_SIZE - 4,
    borderRadius: (RING_SIZE - 4) / 2,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  zodiacIconWrap: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo glow halo (behind the circle)
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PRIMARY,
  },

  // Centre logo circle
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#231C05',
    borderWidth: 2,
    borderColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    // Elevation for depth
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },

  // App name
  appName: {
    marginTop: RING_SIZE / 2 + 32,
    fontSize: 32,
    color: '#F5E9C8',
    fontFamily: fonts.bold,
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  // Tagline
  tagline: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(201,162,39,0.75)',
    fontFamily: fonts.regular,
    letterSpacing: 0.8,
    textAlign: 'center',
  },

  // Loading dots
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY,
    opacity: 0.7,
  },
});
