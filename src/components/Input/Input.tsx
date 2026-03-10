import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

export type InputIconType =
  | 'email'
  | 'password'
  | 'user'
  | 'location'
  | 'clock-outline'
  | 'calendar'
  | 'none';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  leftIcon?: InputIconType;
  rightIcon?: 'eye' | 'eye-off' | null;
  onRightIconPress?: () => void;
  error?: string;
}

export function Input({
  label,
  leftIcon = 'none',
  rightIcon = null,
  onRightIconPress,
  error,
  secureTextEntry,
  ...textInputProps
}: InputProps) {
  const getLeftIconName = (): string => {
    switch (leftIcon) {
      case 'email':
        return 'email-outline';
      case 'password':
        return 'lock-outline';
      case 'user':
        return 'account-outline';
      case 'location':
        return 'map-marker-outline';
      case 'calendar':
        return 'calendar'; 
      case 'clock-outline':
        return 'clock-outline';
      default:
        return 'circle-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}
      >
        {leftIcon !== 'none' && (
          <Icon
            name={getLeftIconName()}
            size={22}
            color={colors.iconMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon !== 'none' && styles.inputWithLeftIcon,
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.rightIconTouchable}
          >
            <Icon
              name={rightIcon === 'eye' ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.iconMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '400',
    fontFamily: fonts.regular,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 48,
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  leftIcon: {
    marginLeft: 14,
  },
  rightIconTouchable: {
    padding: 12,
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
    marginLeft: 4,
    fontFamily: fonts.regular,
  },
});
