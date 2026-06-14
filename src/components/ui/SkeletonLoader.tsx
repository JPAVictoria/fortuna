import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonLoader({ width = '100%', height = 16, borderRadius = 8, style }: Props) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: theme.border, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonLoader width={44} height={44} borderRadius={12} />
        <View style={styles.lines}>
          <SkeletonLoader width="60%" height={14} />
          <SkeletonLoader width="40%" height={11} />
        </View>
        <SkeletonLoader width={60} height={14} borderRadius={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lines: { flex: 1, gap: 6 },
});
