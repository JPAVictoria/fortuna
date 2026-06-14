import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/utils';

type DataPoint = { label: string; total: number };

type Props = {
  data: DataPoint[];
  currencySymbol?: string;
};

const CHART_H = 100;
const PAD_H = 6;
const PAD_TOP = 16;
const PAD_BOT = 20;

export function SpendingTrendChart({ data, currencySymbol = DEFAULT_CURRENCY_SYMBOL }: Props) {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const hasData = data.some(d => d.total > 0);
  if (!hasData) return null;

  const maxVal = Math.max(...data.map(d => d.total), 1);
  const plotW = containerWidth - PAD_H * 2;
  const plotH = CHART_H - PAD_TOP - PAD_BOT;
  const totalPoints = data.length;

  const pts = data.map((d, i) => ({
    x: PAD_H + (totalPoints <= 1 ? plotW / 2 : (i / (totalPoints - 1)) * plotW),
    y: PAD_TOP + (1 - d.total / maxVal) * plotH,
    label: d.label,
    total: d.total,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} Z`;

  const peak = pts.reduce((a, b) => (b.total > a.total ? b : a), pts[0]);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>6-Month Trend</Text>
        <Text style={[styles.peak, { color: theme.textMuted }]}>
          Peak {peak.label}: {formatCurrency(peak.total, currencySymbol)}
        </Text>
      </View>
      <View onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
        {containerWidth > 0 && (
          <Svg width={containerWidth} height={CHART_H}>
            <Defs>
              <LinearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.primary} stopOpacity="0.18" />
                <Stop offset="1" stopColor={theme.primary} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path d={areaPath} fill="url(#trendGrad)" />
            <Path d={linePath} stroke={theme.primary} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={p.total === peak.total ? 5 : 3} fill={theme.primary} />
            ))}
            {pts.map((p, i) => (
              <SvgText
                key={i}
                x={p.x}
                y={CHART_H - 4}
                textAnchor="middle"
                fontSize={9}
                fill={theme.textMuted}>
                {p.label}
              </SvgText>
            ))}
          </Svg>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FontSize.sm, fontWeight: '700' },
  peak: { fontSize: FontSize.xs },
});
