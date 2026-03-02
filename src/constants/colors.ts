/**
 * Global color palette for KP Jyotish Pro
 */

export const colors = {
  // Primary
  primary: '#FF772F',
  primaryDark: '#E66A28',

  // Backgrounds
  background: '#F8F8F8',
  backgroundSecondary: '#FFFFFF',
  logoBackground: '#F8E8E4',
  logoBorder: '#E8D4CF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#8A8A8A',
  textOnPrimary: '#FFFFFF',

  // Borders & inputs
  border: '#E0E0E0',
  borderFocus: '#FF772F',
  inputBackground: '#FFFFFF',
  placeholder: '#9E9E9E',

  // Links
  link: '#FF772F',

  // Icon
  iconMuted: '#6B6B6B',
} as const;

export type Colors = typeof colors;
