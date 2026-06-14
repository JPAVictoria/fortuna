import { router } from 'expo-router';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExpenseItem } from '@/components/expenses/ExpenseItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories, useCurrentMonthExpenses } from '@/hooks/useExpenses';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency, formatMonth, groupByDate, todayISO } from '@/lib/utils';

export default function ExpensesScreen() {
  const theme = useTheme();
  const { data: settings } = useSettings();
  const { data: expenses = [], isLoading } = useCurrentMonthExpenses();
  const { data: categories = [] } = useCategories();

  const symbol = settings?.currencySymbol ?? '₱';
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const grouped = groupByDate(expenses);

  const sections = grouped.map((g) => ({
    title: g.label,
    data: g.items,
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Expenses</Text>
        <Text style={[styles.month, { color: theme.textSecondary }]}>
          {formatMonth(todayISO())}
        </Text>
      </View>

      {/* Total card */}
      <View style={[styles.totalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>TOTAL SPENT</Text>
        <Text style={[styles.totalAmount, { color: theme.error }]}>
          {formatCurrency(total, symbol)}
        </Text>
        <Text style={[styles.totalCount, { color: theme.textMuted }]}>
          {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {expenses.length === 0 && !isLoading ? (
        <EmptyState
          icon="💳"
          title="No expenses yet"
          subtitle="Tap + to log your first expense this month."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              category={categories.find((c) => c.id === item.categoryId)}
              currencySymbol={symbol}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {section.title}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => router.push('/add-expense')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '700' },
  month: { fontSize: FontSize.sm, marginTop: 2 },
  totalCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  totalAmount: { fontSize: FontSize.xxxl, fontWeight: '700', marginTop: 4 },
  totalCount: { fontSize: FontSize.sm, marginTop: 2 },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  listContent: { paddingBottom: 120 },
});
