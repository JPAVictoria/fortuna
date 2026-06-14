import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavingsGoals, useTotalSaved } from '@/hooks/useSavings';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useHaptics } from '@/hooks/useHaptics';
import { formatCurrency } from '@/lib/utils';
import { SavingsGoal } from '@/types';

export default function SavingsScreen() {
  const theme = useTheme();
  const { data: goals = [], isLoading, refetch } = useSavingsGoals();
  const { total } = useTotalSaved();
  const haptics = useHaptics();
  const symbol = DEFAULT_CURRENCY_SYMBOL;

  const completed = goals.filter(g => g.currentAmount >= g.targetAmount);
  const active = goals.filter(g => g.currentAmount < g.targetAmount);

  function handleDeposit(goal: SavingsGoal) {
    haptics.light();
    router.push({ pathname: '/add-deposit', params: { goalId: goal.id, goalName: goal.name } });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={theme.gold} />}>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Savings</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your wealth, growing.</Text>
        </View>

        {/* Total saved hero */}
        <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.gold + '44' }]}>
          <View style={[styles.goldBar, { backgroundColor: theme.gold }]} />
          <Text style={[styles.heroLabel, { color: theme.gold }]}>TOTAL SAVED</Text>
          <Text style={[styles.heroAmount, { color: theme.text }]}>{formatCurrency(total, symbol)}</Text>
          <Text style={[styles.heroCount, { color: theme.textMuted }]}>
            {active.length} active · {completed.length} completed
          </Text>
        </View>

        {isLoading && (
          <View style={{ gap: Spacing.sm, paddingTop: Spacing.sm }}>
            {[0, 1].map(i => <SkeletonLoader key={i} height={120} borderRadius={14} />)}
          </View>
        )}

        {goals.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <EmptyState icon="🪙" title="No savings goals yet" subtitle="Create your first goal and start building your fortune." />
            <Button label="Create a Goal" onPress={() => router.push('/add-goal')} style={styles.createBtn} />
          </View>
        ) : (
          <>
            {active.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ACTIVE GOALS</Text>
                {active.map(goal => (
                  <SavingsGoalCard key={goal.id} goal={goal} onDeposit={handleDeposit} currencySymbol={symbol} />
                ))}
              </View>
            )}

            {completed.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>COMPLETED 🏆</Text>
                {completed.map(goal => (
                  <SavingsGoalCard key={goal.id} goal={goal} onDeposit={handleDeposit} currencySymbol={symbol} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {goals.length > 0 && !isLoading && <FAB onPress={() => { haptics.light(); router.push('/add-goal'); }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  header: { gap: 2 },
  title: { fontSize: FontSize.xxl, fontWeight: '700' },
  subtitle: { fontSize: FontSize.sm },
  hero: { borderRadius: BorderRadius.xl, borderWidth: 1.5, padding: Spacing.lg, gap: 4, overflow: 'hidden' },
  goldBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  heroLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1 },
  heroAmount: { fontSize: FontSize.display, fontWeight: '700', letterSpacing: -1, lineHeight: 50 },
  heroCount: { fontSize: FontSize.sm },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  emptyWrap: { gap: Spacing.md },
  createBtn: { alignSelf: 'center', paddingHorizontal: Spacing.xl },
});
