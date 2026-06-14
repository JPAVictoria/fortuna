import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/lib/utils';
import { Category } from '@/types';

type Slice = { categoryId: string; amount: number; percentage: number };

type Props = {
  items: Slice[];
  categories: Category[];
  currencySymbol?: string;
  size?: number;
};

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, inner: number, start: number, end: number) {
  const s1 = polarToXY(cx, cy, r, start);
  const s2 = polarToXY(cx, cy, inner, start);
  const e1 = polarToXY(cx, cy, r, end);
  const e2 = polarToXY(cx, cy, inner, end);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${e2.x} ${e2.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${s2.x} ${s2.y}`,
    'Z',
  ].join(' ');
}

export function ExpensePieChart({ items, categories, currencySymbol = '₱', size = 160 }: Props) {
  const theme = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;
  const inner = size * 0.28;

  if (items.length === 0) {
    return (
      <View style={styles.noData}>
        <Text style={[styles.noDataIcon]}>🥧</Text>
        <Text style={[styles.noDataText, { color: theme.textMuted }]}>No data yet</Text>
      </View>
    );
  }

  let angle = 0;
  const slices = items.map(item => {
    const cat = categories.find(c => c.id === item.categoryId);
    const sweep = (item.percentage / 100) * 360;
    const start = angle;
    angle += sweep;
    return { ...item, cat, start, end: angle, sweep };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartWrap}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((s, i) => (
              <Path
                key={i}
                d={slicePath(cx, cy, r, inner, s.start, s.end)}
                fill={s.cat?.color ?? '#6B7280'}
                opacity={0.9}
              />
            ))}
          </G>
        </Svg>
        <View style={[styles.center, { width: inner * 2, height: inner * 2, borderRadius: inner }]}>
          <Text style={[styles.centerLabel, { color: theme.textSecondary }]}>TOTAL</Text>
          <Text style={[styles.centerAmount, { color: theme.text }]}>
            {formatCurrency(items.reduce((s, i) => s + i.amount, 0), currencySymbol)}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {slices.map((s, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: s.cat?.color ?? '#6B7280' }]} />
            <Text style={[styles.legendName, { color: theme.text }]} numberOfLines={1}>
              {s.cat?.icon} {s.cat?.name ?? 'Other'}
            </Text>
            <Text style={[styles.legendPct, { color: theme.textMuted }]}>
              {Math.round(s.percentage)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  chartWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  centerAmount: { fontSize: FontSize.sm, fontWeight: '700', marginTop: 2 },
  legend: { flex: 1, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontSize: FontSize.sm },
  legendPct: { fontSize: FontSize.sm, fontWeight: '600' },
  noData: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  noDataIcon: { fontSize: 32 },
  noDataText: { fontSize: FontSize.sm },
});
