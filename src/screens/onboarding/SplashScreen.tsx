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
import { fonts } from '../../constants';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIMARY = colors.primary; // #FF772F (Orange)
const RING_SIZE = width * 0.6;

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
  onFinish: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.65)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  const centerScale = useRef(new Animated.Value(0)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(25)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(18)).current;

  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    // Ring Animation
    Animated.parallel([
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(ringScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();

    // Center Circle Animation
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(centerScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(centerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Title
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Tagline
    Animated.sequence([
      Animated.delay(1100),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Dots
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Final fade out
    Animated.sequence([
      Animated.delay(3000),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      StatusBar.setHidden(false);
      onFinish();
    });
  }, []);

  const ringDeg = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Background subtle glow */}
      <View style={styles.bgGlow} />

      {/* Rotating Zodiac Ring */}
      <Animated.View
        style={[
          styles.ringContainer,
          {
            opacity: ringOpacity,
            transform: [{ scale: ringScale }, { rotate: ringDeg }],
          },
        ]}
      >
        {ZODIAC_ICONS.map((icon, index) => {
          const angle = (index / ZODIAC_ICONS.length) * 2 * Math.PI;
          const radius = RING_SIZE / 2 - 26;
          const x = radius * Math.cos(angle - Math.PI / 2);
          const y = radius * Math.sin(angle - Math.PI / 2);

          return (
            <Animated.View
              key={icon}
              style={[
                styles.zodiacIconWrap,
                {
                  transform: [
                    { translateX: x },
                    { translateY: y },
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
                size={18}
                color={PRIMARY}
                style={{ opacity: 0.85 }}
              />
            </Animated.View>
          );
        })}

        <View style={styles.ringBorder} />
      </Animated.View>

      {/* Center Circle */}
      <Animated.View
        style={[
          {
            opacity: centerOpacity,
            transform: [{ scale: centerScale }],
          },
        ]}
      />

      {/* App Name - Now in Orange */}
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

      {/* Tagline - Warm Orange tone */}
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

      {/* Loading Dots */}
      <Animated.View style={[styles.dotsContainer, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map(i => (
          <LoadingDot key={i} delay={i * 180} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// Loading Dot Component
function LoadingDot({ delay }: { delay: number }) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounce, {
          toValue: -5.5,
          duration: 380,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 380,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(350),
      ]),
    ).start();
  }, []);

  return <Animated.View style={styles.dot} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bgGlow: {
    position: 'absolute',
    width: width * 1.25,
    height: width * 1.25,
    borderRadius: width * 0.625,
    backgroundColor: PRIMARY,
    opacity: 0.06,
    top: height * 0.45 - width * 0.625,
  },

  ringContainer: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ringBorder: {
    position: 'absolute',
    width: RING_SIZE - 6,
    height: RING_SIZE - 6,
    borderRadius: (RING_SIZE - 6) / 2,
    borderWidth: 1.6,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    opacity: 0.28,
  },

  zodiacIconWrap: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 119, 47, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 119, 47, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Orange App Name
  appName: {
    marginTop: RING_SIZE / 2 + 65,
    fontSize: 35,
    color: PRIMARY, // ← Orange as requested
    fontFamily: fonts.bold,
    letterSpacing: 2.4,
    textAlign: 'center',
  },

  // Warm orange tagline
  tagline: {
    marginTop: 10,
    fontSize: 14.5,
    color: '#FF8A4D', // Soft orange variant (looks elegant)
    fontFamily: fonts.regular,
    letterSpacing: 0.7,
    textAlign: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 60,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: PRIMARY,
    opacity: 0.78,
  },
});
