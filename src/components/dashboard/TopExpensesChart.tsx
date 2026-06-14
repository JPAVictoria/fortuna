import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/lib/utils';
import { Category } from '@/types';

type Props = {
  items: { categoryId: string; amount: number; percentage: number }[];
  categories: Category[];
  currencySymbol?: string;
};

export function TopExpensesChart({ items, categories, currencySymbol = '₱' }: Props) {
  const theme = useTheme();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          No expenses this month yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const cat = categories.find((c) => c.id === item.categoryId);
        const color = cat?.color ?? '#6B7280';

        return (
          <View key={item.categoryId} style={styles.row}>
            <View style={styles.meta}>
              <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
                <Text style={styles.icon}>{cat?.icon ?? '📦'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                  {cat?.name ?? 'Other'}
                </Text>
                <Text style={[styles.amount, { color: theme.textMuted }]}>
                  {formatCurrency(item.amount, currencySymbol)}
                </Text>
              </View>
              <Text style={[styles.pct, { color: theme.textSecondary }]}>
                {Math.round(item.percentage)}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.fill,
                  { width: `${item.percentage}%`, backgroundColor: color },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  empty: { paddingVertical: Spacing.lg, alignItems: 'center' },
  emptyText: { fontSize: FontSize.sm },
  row: { gap: Spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 16 },
  info: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '500' },
  amount: { fontSize: FontSize.sm },
  pct: { fontSize: FontSize.sm, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
