import { StyleSheet, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clamp } from '@/lib/utils';

type Props = {
  progress: number; // 0–1
  color?: string;
  height?: number;
};

export function ProgressBar({ progress, color, height = 8 }: Props) {
  const theme = useTheme();
  const clamped = clamp(progress, 0, 1);

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.border, height, borderRadius: height / 2 },
      ]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: color ?? theme.primary,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
