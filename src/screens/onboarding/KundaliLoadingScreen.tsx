import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

import { RootState, AppDispatch } from '../../redux/store';
import { generateKundali } from '../../redux/slices/kundaliSlice';

const loadingSteps = [
  'Calculating planetary positions...',
  'Analyzing your birth chart...',
  'Aligning cosmic energies...',
  'Generating your Kundali...',
];

export function KundaliLoadingScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const { birthDetails, currentKundali, loading } = useSelector(
    (state: RootState) => state.kundali,
  );

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [stepIndex, setStepIndex] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------------------------
  // Rotation Animation
  // ---------------------------

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  // ---------------------------
  // Loading Text Steps
  // ---------------------------

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStepIndex(prev => {
        if (prev === loadingSteps.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ---------------------------
  // Generate Kundali API Call
  // ---------------------------

  useEffect(() => {
    const generate = async () => {
      if (!birthDetails) return;

      try {
        // Dispatch the generateKundali action
        const result = await dispatch(generateKundali(birthDetails));

        if (generateKundali.fulfilled.match(result)) {
          navigation.replace('MainTabs'); // Navigate after successful API response
        } else {
          // Handle case when the result is not successful
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

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Animated Zodiac Icon */}
        <Animated.View
          style={[styles.iconWrapper, { transform: [{ rotate }] }]}
        >
          <Icon name="zodiac-libra" size={64} color={colors.primary} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Generating Your Kundali</Text>

        {/* Dynamic Step */}
        <Text style={styles.subtitle}>
          {loading
            ? 'Please wait, we are generating your Kundali...'
            : loadingSteps[stepIndex]}
        </Text>
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
