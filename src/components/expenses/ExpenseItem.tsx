import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { FALLBACK_CATEGORY_COLOR } from '@/constants/categories';
import { useDeleteExpense } from '@/hooks/useExpenses';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { Category, Expense } from '@/types';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  expense: Expense;
  category: Category | undefined;
  currencySymbol?: string;
};

export function ExpenseItem({ expense, category, currencySymbol = DEFAULT_CURRENCY_SYMBOL }: Props) {
  const theme = useTheme();
  const { mutate: deleteExpense } = useDeleteExpense();

  function handleLongPress() {
    Alert.alert('Delete Expense', `Remove "${expense.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpense(expense.id),
      },
    ]);
  }

  const fallbackCategory: Category = category ?? {
    id: 'other',
    name: 'Other',
    icon: '📦',
    color: FALLBACK_CATEGORY_COLOR,
    isDefault: true,
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: fallbackCategory.color + '22' }]}>
          <Text style={styles.icon}>{fallbackCategory.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.description, { color: theme.text }]} numberOfLines={1}>
            {expense.description}
          </Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {fallbackCategory.name} · {formatDateShort(expense.date)}
          </Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: theme.textSecondary }]}>
        -{formatCurrency(expense.amount, currencySymbol)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  info: { flex: 1, gap: 2 },
  description: { fontSize: FontSize.md, fontWeight: '500' },
  meta: { fontSize: FontSize.sm },
  amount: { fontSize: FontSize.md, fontWeight: '700', marginLeft: Spacing.sm },
});
