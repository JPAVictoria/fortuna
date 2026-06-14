import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F0FDF4',
    backgroundElement: '#ECFDF5',
    backgroundSelected: '#D1FAE5',
    surface: '#FFFFFF',
    border: '#D1FAE5',
    borderStrong: '#A7F3D0',
    text: '#064E3B',
    textSecondary: '#047857',
    textMuted: '#6B7280',
    primary: '#059669',
    primaryLight: '#10B981',
    primaryDim: 'rgba(5, 150, 105, 0.10)',
    gold: '#D97706',
    goldDim: 'rgba(217, 119, 6, 0.10)',
    error: '#EF4444',
    errorDim: 'rgba(239, 68, 68, 0.10)',
    tabBar: '#FFFFFF',
    tabBarBorder: '#D1FAE5',
    tabActive: '#059669',
    tabInactive: '#9CA3AF',
  },
  dark: {
    background: '#070C07',
    backgroundElement: '#0D160D',
    backgroundSelected: '#162016',
    surface: '#0D160D',
    border: '#1A2A1A',
    borderStrong: '#2D4A2D',
    text: '#F0FDF4',
    textSecondary: '#86EFAC',
    textMuted: '#4B7A4B',
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDim: 'rgba(16, 185, 129, 0.12)',
    gold: '#F59E0B',
    goldDim: 'rgba(245, 158, 11, 0.12)',
    error: '#F87171',
    errorDim: 'rgba(248, 113, 113, 0.12)',
    tabBar: '#0A130A',
    tabBarBorder: '#1A2A1A',
    tabActive: '#34D399',
    tabInactive: '#4B7A4B',
  },
} as const;

export type ThemeColors = typeof Colors.dark;
export type ThemeColor = keyof ThemeColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Legacy aliases
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const FontSize = {
  micro: 10,
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 42,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
