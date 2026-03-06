import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

const loadingSteps = [
  'Calculating planetary positions...',
  'Analyzing your birth chart...',
  'Aligning cosmic energies...',
  'Generating your Kundali...',
];

export function KundaliLoadingScreen({ navigation }: any) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    startRotation();

    const interval = setInterval(() => {
      setStepIndex(prev => {
        if (prev === loadingSteps.length - 1) {
          clearInterval(interval);

          // Navigate after loading
          setTimeout(() => {
            navigation.replace('MainTabs');
          }, 800);

          return prev;
        }

        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Animated Icon */}
        <Animated.View
          style={[styles.iconWrapper, { transform: [{ rotate }] }]}
        >
          <Icon name="zodiac-libra" size={64} color={colors.primary} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Generating Your Kundali</Text>

        {/* Dynamic Step */}
        <Text style={styles.subtitle}>{loadingSteps[stepIndex]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.logoBackground,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
