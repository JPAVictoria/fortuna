import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeableRow } from '@/components/ui/SwipeableRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { FALLBACK_CATEGORY_COLOR } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useCategories, useCurrentMonthExpenses, useDeleteExpense } from '@/hooks/useExpenses';
import { useHaptics } from '@/hooks/useHaptics';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { formatCurrency, formatDateShort, formatMonth, groupByDate, todayISO } from '@/lib/utils';
import { Category, Expense } from '@/types';

export default function ExpensesScreen() {
  const theme = useTheme();
  const { data: expenses = [], isLoading, refetch } = useCurrentMonthExpenses();
  const { data: categories = [] } = useCategories();
  const { mutate: deleteExpense } = useDeleteExpense();
  const haptics = useHaptics();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');

  const symbol = DEFAULT_CURRENCY_SYMBOL;

  const filtered = expenses.filter(e => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategoryId || e.categoryId === filterCategoryId;
    return matchSearch && matchCat;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const grouped = groupByDate(filtered);
  const sections = grouped.map(g => ({ title: g.label, data: g.items }));

  function handleLongPress(expense: Expense) {
    haptics.medium();
    Alert.alert(expense.description, undefined, [
      {
        text: 'Edit',
        onPress: () => router.push({
          pathname: '/edit-expense',
          params: {
            id: expense.id,
            amount: String(expense.amount),
            description: expense.description,
            categoryId: expense.categoryId,
            date: expense.date,
            notes: expense.notes ?? '',
          },
        }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          haptics.warning();
          Alert.alert('Delete Expense', `Remove "${expense.description}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => { deleteExpense(expense.id); haptics.success(); toast('Expense deleted'); },
            },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Expenses</Text>
          <Text style={[styles.month, { color: theme.textSecondary }]}>{formatMonth(todayISO())}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search expenses..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={12}>
            <Text style={[styles.clearBtn, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <SectionList
          ListHeaderComponent={
            <>
              {/* Total card */}
              <View style={[styles.totalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>TOTAL SPENT</Text>
                <Text style={[styles.totalAmount, { color: theme.error }]}>{formatCurrency(total, symbol)}</Text>
                <Text style={[styles.totalCount, { color: theme.textMuted }]}>
                  {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* Category filter */}
              <View style={styles.filterRow}>
                <TouchableOpacity
                  onPress={() => setFilterCategoryId('')}
                  style={[styles.filterChip, { backgroundColor: !filterCategoryId ? theme.primaryDim : theme.backgroundElement, borderColor: !filterCategoryId ? theme.primary : theme.border }]}>
                  <Text style={[styles.filterLabel, { color: !filterCategoryId ? theme.primary : theme.textMuted }]}>All</Text>
                </TouchableOpacity>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setFilterCategoryId(cat.id === filterCategoryId ? '' : cat.id)}
                    style={[styles.filterChip, { backgroundColor: filterCategoryId === cat.id ? cat.color + '22' : theme.backgroundElement, borderColor: filterCategoryId === cat.id ? cat.color : theme.border }]}>
                    <Text style={styles.filterIcon}>{cat.icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId);
            return (
              <SwipeableRow onDelete={() => handleLongPress(item)}>
                <TouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                  activeOpacity={0.85}
                  style={[styles.expenseRow, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                  <View style={[styles.iconWrap, { backgroundColor: (cat?.color ?? FALLBACK_CATEGORY_COLOR) + '22' }]}>
                    <Text style={styles.icon}>{cat?.icon ?? '📦'}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.desc, { color: theme.text }]} numberOfLines={1}>{item.description}</Text>
                    <Text style={[styles.meta, { color: theme.textMuted }]}>{cat?.name ?? 'Other'} · {formatDateShort(item.date)}</Text>
                  </View>
                  <Text style={[styles.amount, { color: theme.error }]}>-{formatCurrency(item.amount, symbol)}</Text>
                </TouchableOpacity>
              </SwipeableRow>
            );
          }}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={theme.primary} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="💳" title="No expenses found" subtitle={search ? 'Try a different search term.' : 'Tap + to log your first expense.'} />
          }
        />
      )}

      <FAB onPress={() => { haptics.light(); router.push('/add-expense'); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, paddingTop: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: FontSize.xxl, fontWeight: '700' },
  month: { fontSize: FontSize.sm, marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginTop: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 44 },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: FontSize.md },
  clearBtn: { fontSize: FontSize.md, paddingLeft: 8 },
  totalCard: { marginHorizontal: Spacing.md, marginTop: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  totalLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  totalAmount: { fontSize: FontSize.xxxl, fontWeight: '700', marginTop: 4 },
  totalCount: { fontSize: FontSize.sm, marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, gap: 8, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1.5 },
  filterLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  filterIcon: { fontSize: 14 },
  sectionHeader: { paddingHorizontal: Spacing.md, paddingVertical: 6 },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  listContent: { paddingBottom: 120 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  info: { flex: 1, gap: 2 },
  desc: { fontSize: FontSize.md, fontWeight: '500' },
  meta: { fontSize: FontSize.sm },
  amount: { fontSize: FontSize.md, fontWeight: '700' },
});
