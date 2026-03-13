import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

interface PredictionSectionTitleProps {
  label: string;
}

export function PredictionSectionTitle({ label }: PredictionSectionTitleProps) {
  return <Text style={styles.title}>{label}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
    marginTop: 4,
  },
});
