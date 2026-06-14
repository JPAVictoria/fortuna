import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useExpenses';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { getCurrentMonthKey, getMonthKey, formatCurrency } from '@/lib/utils';

type Insight = { icon: string; text: string; type: 'good' | 'warning' | 'info' };

export function SpendingInsights({ currencySymbol = DEFAULT_CURRENCY_SYMBOL }: { currencySymbol?: string }) {
  const theme = useTheme();
  const [showAll, setShowAll] = useState(false);
  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useCategories();

  const currentKey = getCurrentMonthKey();
  const prevKey = (() => {
    const [y, m] = currentKey.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();

  const current = expenses.filter(e => getMonthKey(e.date) === currentKey);
  const prev = expenses.filter(e => getMonthKey(e.date) === prevKey);

  const currentTotal = current.reduce((s, e) => s + e.amount, 0);
  const prevTotal = prev.reduce((s, e) => s + e.amount, 0);

  const insights: Insight[] = [];

  // Month-over-month change
  if (prevTotal > 0 && currentTotal > 0) {
    const pct = ((currentTotal - prevTotal) / prevTotal) * 100;
    if (pct > 10) {
      insights.push({
        icon: '📈',
        text: `Spending is up ${Math.abs(Math.round(pct))}% vs last month (${formatCurrency(prevTotal, currencySymbol)})`,
        type: 'warning',
      });
    } else if (pct < -10) {
      insights.push({
        icon: '📉',
        text: `Great! Spending down ${Math.abs(Math.round(pct))}% vs last month. You saved ${formatCurrency(prevTotal - currentTotal, currencySymbol)} more.`,
        type: 'good',
      });
    }
  }

  // Top category this month
  if (current.length > 0) {
    const catTotals: Record<string, number> = {};
    for (const e of current) catTotals[e.categoryId] = (catTotals[e.categoryId] ?? 0) + e.amount;
    const [topId, topAmt] = Object.entries(catTotals).sort(([, a], [, b]) => b - a)[0];
    const cat = categories.find(c => c.id === topId);
    const pct = currentTotal > 0 ? Math.round((topAmt / currentTotal) * 100) : 0;
    if (pct > 50 && cat) {
      insights.push({
        icon: '⚠️',
        text: `${cat.icon} ${cat.name} is ${pct}% of your spending this month. Consider diversifying.`,
        type: 'warning',
      });
    }
  }

  // No spending yet this month
  if (current.length === 0) {
    insights.push({ icon: '🌱', text: 'No expenses logged yet this month. Start tracking to see insights.', type: 'info' });
  }

  // Positive streak
  if (current.length >= 5 && prevTotal > 0 && currentTotal <= prevTotal) {
    insights.push({ icon: '🏆', text: 'You\'re on track to spend less than last month. Keep it up!', type: 'good' });
  }

  if (insights.length === 0) {
    insights.push({ icon: '✨', text: 'Your spending looks balanced this month.', type: 'good' });
  }

  const insightColor = (type: Insight['type']) =>
    type === 'good' ? theme.primary : type === 'warning' ? theme.gold : theme.textSecondary;

  const visible = showAll ? insights : insights.slice(0, 2);

  return (
    <View style={styles.container}>
      {visible.map((ins, i) => (
        <View
          key={i}
          style={[
            styles.row,
            {
              backgroundColor:
                ins.type === 'good' ? theme.primaryDim :
                ins.type === 'warning' ? theme.goldDim :
                theme.backgroundElement,
              borderColor: insightColor(ins.type) + '44',
            },
          ]}>
          <Text style={styles.icon}>{ins.icon}</Text>
          <Text style={[styles.text, { color: theme.text }]}>{ins.text}</Text>
        </View>
      ))}
      {insights.length > 2 && (
        <TouchableOpacity onPress={() => setShowAll(v => !v)} style={styles.viewAll}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>
            {showAll ? 'Show less' : `View all ${insights.length} insights →`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  icon: { fontSize: 16, marginTop: 1 },
  text: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },
  viewAll: { paddingTop: Spacing.xs, alignItems: 'center' },
  viewAllText: { fontSize: FontSize.sm, fontWeight: '600' },
});
