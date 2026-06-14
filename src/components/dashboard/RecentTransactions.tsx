import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { Category, Expense } from '@/types';

type Props = {
  expenses: Expense[];
  categories: Category[];
  onViewAll: () => void;
  currencySymbol?: string;
};

export function RecentTransactions({
  expenses,
  categories,
  onViewAll,
  currencySymbol = '₱',
}: Props) {
  const theme = useTheme();

  return (
    <View>
      {expenses.map((expense) => {
        const cat = categories.find((c) => c.id === expense.categoryId);
        const color = cat?.color ?? '#6B7280';

        return (
          <View
            key={expense.id}
            style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
              <Text style={styles.icon}>{cat?.icon ?? '📦'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.desc, { color: theme.text }]} numberOfLines={1}>
                {expense.description}
              </Text>
              <Text style={[styles.meta, { color: theme.textMuted }]}>
                {cat?.name ?? 'Other'} · {formatDateShort(expense.date)}
              </Text>
            </View>
            <Text style={[styles.amount, { color: theme.error }]}>
              -{formatCurrency(expense.amount, currencySymbol)}
            </Text>
          </View>
        );
      })}

      {expenses.length === 0 && (
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          No transactions this month
        </Text>
      )}

      {expenses.length > 0 && (
        <TouchableOpacity onPress={onViewAll} style={styles.viewAll}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>View all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 16 },
  info: { flex: 1, gap: 2 },
  desc: { fontSize: FontSize.md, fontWeight: '500' },
  meta: { fontSize: FontSize.sm },
  amount: { fontSize: FontSize.md, fontWeight: '700' },
  empty: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.lg },
  viewAll: { paddingTop: Spacing.md, alignItems: 'center' },
  viewAllText: { fontSize: FontSize.sm, fontWeight: '600' },
});
