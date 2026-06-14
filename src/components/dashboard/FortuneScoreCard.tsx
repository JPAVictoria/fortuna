import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FortuneScore } from '@/hooks/useFortuneScore';

type Props = { score: FortuneScore };

const GRADE_COLORS: Record<string, string> = {
  S: '#F59E0B',
  A: '#10B981',
  B: '#34D399',
  C: '#60A5FA',
  D: '#F87171',
  F: '#EF4444',
};

function RadialRing({ value, size = 80 }: { value: number; size?: number }) {
  const theme = useTheme();
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.border} strokeWidth={8} />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={GRADE_COLORS[value >= 90 ? 'S' : value >= 75 ? 'A' : value >= 60 ? 'B' : value >= 45 ? 'C' : value >= 30 ? 'D' : 'F']}
        strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2},${size / 2}`}
      />
    </Svg>
  );
}

export function FortuneScoreCard({ score }: Props) {
  const theme = useTheme();
  const gradeColor = GRADE_COLORS[score.grade];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.left}>
        <Text style={[styles.title, { color: theme.text }]}>Fortune Score</Text>
        <Text style={[styles.insight, { color: theme.textMuted }]}>{score.insight}</Text>

        <View style={styles.breakdown}>
          <ScoreRow label="Savings" value={score.savingsRate} max={40} color={theme.primary} theme={theme} />
          <ScoreRow label="Budget" value={score.budgetScore} max={30} color={theme.primaryLight} theme={theme} />
          <ScoreRow label="Diversity" value={score.diversityScore} max={15} color={theme.gold} theme={theme} />
          <ScoreRow label="Goals" value={score.goalsScore} max={15} color={theme.gold} theme={theme} />
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.ring}>
          <RadialRing value={score.total} size={88} />
          <View style={styles.ringCenter}>
            <Text style={[styles.grade, { color: gradeColor }]}>{score.grade}</Text>
          </View>
        </View>
        <Text style={[styles.score, { color: theme.textSecondary }]}>{score.total}/100</Text>
      </View>
    </View>
  );
}

function ScoreRow({
  label,
  value,
  max,
  color,
  theme,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  theme: any;
}) {
  return (
    <View style={styles.scoreRow}>
      <Text style={[styles.scoreLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.fill, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.scoreVal, { color: theme.textSecondary }]}>{value}/{max}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  left: { flex: 1, gap: Spacing.sm },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  insight: { fontSize: FontSize.sm, lineHeight: 18 },
  breakdown: { gap: 6 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scoreLabel: { fontSize: 10, width: 52 },
  track: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  scoreVal: { fontSize: 10, width: 28, textAlign: 'right' },
  right: { alignItems: 'center', gap: 4 },
  ring: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute' },
  grade: { fontSize: FontSize.xl, fontWeight: '800' },
  score: { fontSize: FontSize.xs },
});
