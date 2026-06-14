import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalanceHeader } from '@/components/dashboard/BalanceHeader';
import { ExpensePieChart } from '@/components/dashboard/ExpensePieChart';
import { FortunaQuote } from '@/components/dashboard/FortunaQuote';
import { FortuneScoreCard } from '@/components/dashboard/FortuneScoreCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingInsights } from '@/components/dashboard/SpendingInsights';
import { TopExpensesChart } from '@/components/dashboard/TopExpensesChart';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories, useCurrentMonthExpenses, useTopCategories } from '@/hooks/useExpenses';
import { useFortuneScore } from '@/hooks/useFortuneScore';
import { useTotalSaved } from '@/hooks/useSavings';
import { DEFAULT_CURRENCY_SYMBOL, useSettings } from '@/hooks/useSettings';
import { formatMonth, getGreeting, todayISO } from '@/lib/utils';

export default function DashboardScreen() {
  const theme = useTheme();
  const { data: settings } = useSettings();
  const { data: monthExpenses = [], isLoading, refetch } = useCurrentMonthExpenses();
  const { data: categories = [] } = useCategories();
  const { data: topCategories } = useTopCategories(3);
  const { data: allTopCategories } = useTopCategories(10);
  const { total: totalSaved } = useTotalSaved();
  const fortuneScore = useFortuneScore();

  const symbol = DEFAULT_CURRENCY_SYMBOL;
  const name = settings?.userName ?? 'You';
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const budget = settings?.monthlyBudget;
  const recentFive = monthExpenses.slice(0, 5);
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <FortunaLogo size={40} />
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                {getGreeting()}, {name}
              </Text>
              <Text style={[styles.month, { color: theme.text }]}>{formatMonth(todayISO())}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/add-expense')}
            style={[styles.quickAdd, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '44' }]}>
            <Text style={[styles.quickAddLabel, { color: theme.primary }]}>+ Log</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Quote */}
        <FortunaQuote />

        {/* Balance Hero */}
        <BalanceHeader
          totalSpent={totalSpent}
          totalSaved={totalSaved}
          monthlyBudget={budget}
          currencySymbol={symbol}
        />

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/add-expense')}>
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.goldDim }]}
            onPress={() => router.push('/add-goal')}>
            <Text style={styles.actionIcon}>🪙</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Save Money</Text>
          </TouchableOpacity>
        </View>

        {/* Spending Insights */}
        {monthExpenses.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Insights</Text>
            <SpendingInsights currencySymbol={symbol} />
          </View>
        )}

        {/* Fortune Score (collapsible) */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setScoreExpanded(e => !e)}
            style={styles.sectionHeader}
            accessibilityLabel={scoreExpanded ? 'Collapse Fortune Score' : 'Expand Fortune Score'}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Fortune Score</Text>
            <Text style={[styles.chevron, { color: theme.textMuted }]}>{scoreExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {scoreExpanded && <FortuneScoreCard score={fortuneScore} />}
          {!scoreExpanded && (
            <TouchableOpacity
              onPress={() => setScoreExpanded(true)}
              style={[styles.scoreCollapsed, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.scoreGrade, { color: fortuneScore.total >= 75 ? theme.primary : theme.gold }]}>
                {fortuneScore.grade}
              </Text>
              <Text style={[styles.scoreNum, { color: theme.textSecondary }]}>{fortuneScore.total}/100</Text>
              <Text style={[styles.scoreInsight, { color: theme.textMuted }]} numberOfLines={1}>{fortuneScore.insight}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pie Chart */}
        {monthExpenses.length > 0 && (
          <Card padded>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Breakdown</Text>
            <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Where your money goes</Text>
            <View style={{ marginTop: Spacing.md }}>
              <ExpensePieChart
                items={allTopCategories ?? []}
                categories={categories}
                currencySymbol={symbol}
              />
            </View>
          </Card>
        )}

        {/* Top 3 Categories */}
        <Card padded>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Categories</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>This month's spending</Text>
          <View style={{ marginTop: Spacing.md }}>
            <TopExpensesChart items={topCategories ?? []} categories={categories} currencySymbol={symbol} />
          </View>
        </Card>

        {/* Recent */}
        <Card padded>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent</Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Last 5 transactions</Text>
          <View style={{ marginTop: Spacing.sm }}>
            <RecentTransactions
              expenses={recentFive}
              categories={categories}
              onViewAll={() => router.push('/expenses')}
              currencySymbol={symbol}
            />
          </View>
        </Card>

        {monthExpenses.length === 0 && !isLoading && (
          <EmptyState
            icon="🌱"
            title="Your fortune starts here"
            subtitle="Log your first expense to begin tracking your financial journey."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  greeting: { fontSize: FontSize.sm, fontWeight: '600' },
  month: { fontSize: FontSize.lg, fontWeight: '700', marginTop: 1 },
  quickAdd: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  quickAddLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1 },
  actionIcon: { fontSize: 20 },
  actionLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  sectionSub: { fontSize: FontSize.sm, marginTop: 2 },
  chevron: { fontSize: FontSize.xs },
  scoreCollapsed: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1 },
  scoreGrade: { fontSize: FontSize.xxl, fontWeight: '800', width: 36 },
  scoreNum: { fontSize: FontSize.sm, fontWeight: '600' },
  scoreInsight: { flex: 1, fontSize: FontSize.sm },
});
