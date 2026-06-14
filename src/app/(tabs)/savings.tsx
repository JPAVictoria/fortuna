import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavingsGoals, useTotalSaved } from '@/hooks/useSavings';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/utils';
import { SavingsGoal } from '@/types';

export default function SavingsScreen() {
  const theme = useTheme();
  const { data: goals = [], isLoading } = useSavingsGoals();
  const { total } = useTotalSaved();
  const { data: settings } = useSettings();
  const symbol = settings?.currencySymbol ?? '₱';

  function handleDeposit(goal: SavingsGoal) {
    router.push({ pathname: '/add-deposit', params: { goalId: goal.id, goalName: goal.name } });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Savings</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your wealth, growing.
          </Text>
        </View>

        {/* Total savings hero */}
        <View
          style={[
            styles.hero,
            { backgroundColor: theme.surface, borderColor: theme.gold + '44' },
          ]}>
          <View style={[styles.goldBar, { backgroundColor: theme.gold }]} />
          <Text style={[styles.heroLabel, { color: theme.gold }]}>TOTAL SAVED</Text>
          <Text style={[styles.heroAmount, { color: theme.text }]}>
            {formatCurrency(total, symbol)}
          </Text>
          <Text style={[styles.heroCount, { color: theme.textMuted }]}>
            {goals.length} active goal{goals.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Goals */}
        {goals.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="🪙"
              title="No savings goals yet"
              subtitle="Create your first goal and start building your fortune."
            />
            <Button
              label="Create a Goal"
              onPress={() => router.push('/add-goal')}
              style={styles.createBtn}
            />
          </View>
        ) : (
          <View style={styles.goals}>
            {goals.map((goal) => (
              <SavingsGoalCard
                key={goal.id}
                goal={goal}
                onDeposit={handleDeposit}
                currencySymbol={symbol}
              />
            ))}
          </View>
        )}

      </ScrollView>

      {goals.length > 0 && <FAB onPress={() => router.push('/add-goal')} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  header: { gap: 2 },
  title: { fontSize: FontSize.xxl, fontWeight: '700' },
  subtitle: { fontSize: FontSize.sm },
  hero: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.lg,
    gap: 4,
    overflow: 'hidden',
  },
  goldBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  heroLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroAmount: {
    fontSize: FontSize.display,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 50,
  },
  heroCount: { fontSize: FontSize.sm },
  goals: { gap: Spacing.sm },
  emptyWrap: { gap: Spacing.md },
  createBtn: { alignSelf: 'center', paddingHorizontal: Spacing.xl },
});
