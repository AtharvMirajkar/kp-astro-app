import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const ringColor =
    score >= 75 ? '#3BAA72' : score >= 50 ? '#C9A227' : '#E07A5F';

  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius,
          borderColor: ringColor,
        },
      ]}
    >
      <Text style={[styles.score, { color: ringColor }]}>{score}</Text>
      <Text style={styles.outOf}>/100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  score: {
    fontSize: 22,
    fontFamily: fonts.bold,
    lineHeight: 26,
  },
  outOf: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
});
