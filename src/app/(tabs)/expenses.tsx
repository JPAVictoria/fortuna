import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, RefreshControl, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeableRow } from '@/components/ui/SwipeableRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { FALLBACK_CATEGORY_COLOR } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useCategories, useExpensesByMonth, useDeleteExpense } from '@/hooks/useExpenses';
import { useHaptics } from '@/hooks/useHaptics';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { formatCurrency, formatDateShort, formatMonthKey, getMonthKeyByOffset, groupByDate, todayISO } from '@/lib/utils';
import { Expense } from '@/types';

export default function ExpensesScreen() {
  const theme = useTheme();
  const { data: categories = [] } = useCategories();
  const { mutate: deleteExpense } = useDeleteExpense();
  const haptics = useHaptics();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');
  const [monthOffset, setMonthOffset] = useState(0);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const monthKey = getMonthKeyByOffset(monthOffset);
  const { data: expenses = [], isLoading, refetch } = useExpensesByMonth(monthKey);

  const symbol = DEFAULT_CURRENCY_SYMBOL;

  const filtered = expenses.filter(e => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategoryId || e.categoryId === filterCategoryId;
    return matchSearch && matchCat;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const grouped = groupByDate(filtered);
  const sections = grouped.map(g => ({
    title: g.label,
    subtotal: g.items.reduce((s, e) => s + e.amount, 0),
    data: g.items,
  }));

  function deleteWithUndo(expense: Expense) {
    haptics.success();
    undoRef.current = setTimeout(() => deleteExpense(expense.id), 3000);
    toast('Expense deleted', { type: 'info', undoLabel: 'Undo', onUndo: () => { if (undoRef.current) clearTimeout(undoRef.current); } });
  }

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
      { text: 'Delete', style: 'destructive', onPress: () => deleteWithUndo(expense) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header with month selector */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Expenses</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => setMonthOffset(o => o - 1)} hitSlop={12} accessibilityLabel="Previous month">
            <Text style={[styles.arrow, { color: theme.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: theme.text }]}>{formatMonthKey(monthKey)}</Text>
          <TouchableOpacity
            onPress={() => setMonthOffset(o => Math.min(0, o + 1))}
            hitSlop={12}
            disabled={monthOffset === 0}
            accessibilityLabel="Next month">
            <Text style={[styles.arrow, { color: monthOffset === 0 ? theme.border : theme.primary }]}>›</Text>
          </TouchableOpacity>
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
          autoCorrect={false}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={12} accessibilityLabel="Clear search">
            <Text style={[styles.clearBtn, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading && (
        <View style={{ paddingTop: Spacing.sm }}>
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </View>
      )}

      {!isLoading && (
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

              {/* Category filter — horizontal scroll */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
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
              </ScrollView>
            </>
          }
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId);
            return (
              <SwipeableRow onDelete={() => deleteWithUndo(item)}>
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
              <Text style={[styles.sectionSubtotal, { color: theme.textMuted }]}>
                {formatCurrency(section.subtotal, symbol)}
              </Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={theme.primary} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            search
              ? (
                <View style={styles.emptySearch}>
                  <Text style={[styles.emptySearchText, { color: theme.textMuted }]}>No results for "{search}"</Text>
                  <TouchableOpacity onPress={() => setSearch('')} style={[styles.clearSearchBtn, { borderColor: theme.primary }]}>
                    <Text style={[styles.clearSearchLabel, { color: theme.primary }]}>Clear search</Text>
                  </TouchableOpacity>
                </View>
              )
              : <EmptyState icon="💳" title="No expenses" subtitle="Tap + to log your first expense this month." />
          }
        />
      )}

      {!isLoading && <FAB onPress={() => { haptics.light(); router.push('/add-expense'); }} accessibilityLabel="Log expense" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, paddingTop: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: FontSize.xxl, fontWeight: '700' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  arrow: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  monthLabel: { fontSize: FontSize.sm, fontWeight: '600', flex: 1, textAlign: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginTop: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 44 },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: FontSize.md },
  clearBtn: { fontSize: FontSize.md, paddingLeft: 8 },
  totalCard: { marginHorizontal: Spacing.md, marginTop: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.sm },
  totalLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  totalAmount: { fontSize: FontSize.xxxl, fontWeight: '700', marginTop: 4 },
  totalCount: { fontSize: FontSize.sm, marginTop: 2 },
  filterRow: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, gap: 8, flexDirection: 'row' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1.5 },
  filterLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  filterIcon: { fontSize: 14 },
  sectionHeader: { paddingHorizontal: Spacing.md, paddingVertical: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionSubtotal: { fontSize: FontSize.sm, fontWeight: '600' },
  listContent: { paddingBottom: 120 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  info: { flex: 1, gap: 2 },
  desc: { fontSize: FontSize.md, fontWeight: '500' },
  meta: { fontSize: FontSize.sm },
  amount: { fontSize: FontSize.md, fontWeight: '700' },
  emptySearch: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.md },
  emptySearchText: { fontSize: FontSize.md },
  clearSearchBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 10, borderRadius: BorderRadius.full, borderWidth: 1.5 },
  clearSearchLabel: { fontSize: FontSize.sm, fontWeight: '600' },
});
