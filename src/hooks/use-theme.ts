import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/theme';
import { useSettings } from '@/hooks/useSettings';

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function useTheme(): ThemeColors {
  const scheme = useColorScheme();
  const base = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { data: settings } = useSettings();
  const accent = settings?.accentColor;
  if (!accent) return base;
  const rgb = hexToRgb(accent);
  return {
    ...base,
    primary: accent,
    primaryLight: accent,
    primaryDim: `rgba(${rgb}, ${scheme === 'dark' ? '0.12' : '0.10'})`,
    tabActive: accent,
  };
}
