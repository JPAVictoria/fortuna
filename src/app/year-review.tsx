import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories, useExpenses } from '@/hooks/useExpenses';
import { useTotalSaved } from '@/hooks/useSavings';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { formatCurrency, getMonthKey } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearReviewScreen() {
  const theme = useTheme();
  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useCategories();
  const { total: totalSaved } = useTotalSaved();
  const symbol = DEFAULT_CURRENCY_SYMBOL;

  const year = new Date().getFullYear();

  const yearExpenses = expenses.filter(e => e.date.startsWith(String(year)));
  const yearTotal = yearExpenses.reduce((s, e) => s + e.amount, 0);

  const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`;
    return {
      label: MONTHS[i],
      total: yearExpenses.filter(e => getMonthKey(e.date) === key).reduce((s, e) => s + e.amount, 0),
      key,
    };
  });

  const maxMonth = Math.max(...monthlyTotals.map(m => m.total), 1);
  const bestMonth = monthlyTotals.reduce((a, b) => (b.total > 0 && (a.total === 0 || b.total < a.total) ? b : a), monthlyTotals[0]);
  const worstMonth = monthlyTotals.reduce((a, b) => (b.total > a.total ? b : a), monthlyTotals[0]);

  const catTotals: Record<string, number> = {};
  for (const e of yearExpenses) catTotals[e.categoryId] = (catTotals[e.categoryId] ?? 0) + e.amount;
  const topCatEntry = Object.entries(catTotals).sort(([, a], [, b]) => b - a)[0];
  const topCat = topCatEntry ? categories.find(c => c.id === topCatEntry[0]) : null;

  const avgMonthly = yearTotal > 0 ? yearTotal / Math.max(monthlyTotals.filter(m => m.total > 0).length, 1) : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={16} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{year} Year in Review</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero stats */}
        <View style={styles.heroGrid}>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>TOTAL SPENT</Text>
            <Text style={[styles.heroAmt, { color: theme.text }]}>{formatCurrency(yearTotal, symbol)}</Text>
          </View>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.goldDim }]}>
            <Text style={[styles.heroLabel, { color: theme.gold }]}>TOTAL SAVED</Text>
            <Text style={[styles.heroAmt, { color: theme.gold }]}>{formatCurrency(totalSaved, symbol)}</Text>
          </View>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>AVG / MONTH</Text>
            <Text style={[styles.heroAmt, { color: theme.text }]}>{formatCurrency(avgMonthly, symbol)}</Text>
          </View>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>TRANSACTIONS</Text>
            <Text style={[styles.heroAmt, { color: theme.text }]}>{yearExpenses.length}</Text>
          </View>
        </View>

        {/* Month-by-month */}
        <Card padded>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Breakdown</Text>
          <View style={styles.monthBars}>
            {monthlyTotals.map(m => (
              <View key={m.key} style={styles.monthBar}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${(m.total / maxMonth) * 100}%`, backgroundColor: m.total === worstMonth.total && m.total > 0 ? theme.gold : m.total === bestMonth.total && m.total > 0 ? theme.primary : theme.primaryLight }]} />
                </View>
                <Text style={[styles.barLabel, { color: theme.textMuted }]}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Highlights */}
        <Card padded>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Highlights</Text>
          <View style={styles.highlights}>
            {topCat && (
              <View style={[styles.highlight, { backgroundColor: topCat.color + '1A', borderColor: topCat.color + '44' }]}>
                <Text style={styles.highlightIcon}>{topCat.icon}</Text>
                <View style={styles.highlightInfo}>
                  <Text style={[styles.highlightTitle, { color: theme.text }]}>Top Category</Text>
                  <Text style={[styles.highlightValue, { color: topCat.color }]}>{topCat.name} · {formatCurrency(topCatEntry[1], symbol)}</Text>
                </View>
              </View>
            )}
            {bestMonth.total > 0 && (
              <View style={[styles.highlight, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '44' }]}>
                <Text style={styles.highlightIcon}>🏅</Text>
                <View style={styles.highlightInfo}>
                  <Text style={[styles.highlightTitle, { color: theme.text }]}>Best Month</Text>
                  <Text style={[styles.highlightValue, { color: theme.primary }]}>{bestMonth.label} · {formatCurrency(bestMonth.total, symbol)}</Text>
                </View>
              </View>
            )}
            {worstMonth.total > 0 && (
              <View style={[styles.highlight, { backgroundColor: theme.goldDim, borderColor: theme.gold + '44' }]}>
                <Text style={styles.highlightIcon}>📈</Text>
                <View style={styles.highlightInfo}>
                  <Text style={[styles.highlightTitle, { color: theme.text }]}>Highest Spending</Text>
                  <Text style={[styles.highlightValue, { color: theme.gold }]}>{worstMonth.label} · {formatCurrency(worstMonth.total, symbol)}</Text>
                </View>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  title: { fontSize: FontSize.lg, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  heroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  heroCard: { flex: 1, minWidth: '45%', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, gap: 4 },
  heroLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  heroAmt: { fontSize: FontSize.xl, fontWeight: '700' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.md },
  monthBars: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  monthBar: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 3, minHeight: 2 },
  barLabel: { fontSize: 8, fontWeight: '600' },
  highlights: { gap: Spacing.sm },
  highlight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1 },
  highlightIcon: { fontSize: 24 },
  highlightInfo: { flex: 1, gap: 2 },
  highlightTitle: { fontSize: FontSize.sm, fontWeight: '600' },
  highlightValue: { fontSize: FontSize.md, fontWeight: '700' },
});
