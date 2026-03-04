import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants';

export interface OptionSelectModalOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface OptionSelectModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: OptionSelectModalOption[];
  selectedValue: string;
  onApply: (value: string) => void;
  applyButtonText: string;
  disclaimerText?: string;
  titleIcon?: string;
  activeSubLabel?: string;
}

export function OptionSelectModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onApply,
  applyButtonText,
  disclaimerText,
  titleIcon = 'star-outline',
  activeSubLabel,
}: OptionSelectModalProps) {
  const [pendingValue, setPendingValue] = useState(selectedValue);

  useEffect(() => {
    if (visible) {
      setPendingValue(selectedValue);
    }
  }, [visible, selectedValue]);

  const handleApply = () => {
    onApply(pendingValue);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handleBar} />
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.titleIconWrap}>
                    <Icon name={titleIcon} size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.title}>{title}</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsList}>
                {options.map(opt => {
                  const isSelected = pendingValue === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setPendingValue(opt.value)}
                      style={[
                        styles.optionRow,
                        isSelected && styles.optionRowSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <View style={styles.optionTextWrap}>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        {isSelected && activeSubLabel && (
                          <Text style={styles.optionActiveSub}>
                            {activeSubLabel}
                          </Text>
                        )}
                        {!isSelected && opt.subLabel && (
                          <Text style={styles.optionSubLabel}>
                            {opt.subLabel}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Icon
                          name="check-circle"
                          size={22}
                          color={colors.primary}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.85}
              >
                <Icon
                  name="check"
                  size={20}
                  color={colors.textOnPrimary}
                  style={styles.applyButtonIcon}
                />
                <Text style={styles.applyButtonText}>{applyButtonText}</Text>
              </TouchableOpacity>

              {disclaimerText ? (
                <Text style={styles.disclaimer}>{disclaimerText}</Text>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    gap: 10,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  optionRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.logoBackground,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.textPrimary,
  },
  optionSubLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionActiveSub: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  applyButtonIcon: {
    marginRight: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textOnPrimary,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
