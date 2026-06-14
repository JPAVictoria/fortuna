import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDeleteSavingsGoal } from '@/hooks/useSavings';
import { daysUntil, formatCurrency } from '@/lib/utils';
import { SavingsGoal } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Props = {
  goal: SavingsGoal;
  onDeposit: (goal: SavingsGoal) => void;
  currencySymbol?: string;
};

export function SavingsGoalCard({ goal, onDeposit, currencySymbol = '₱' }: Props) {
  const theme = useTheme();
  const { mutate: deleteGoal } = useDeleteSavingsGoal();
  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
  const isComplete = progress >= 1;

  const days = goal.deadline ? daysUntil(goal.deadline) : null;

  function handleLongPress() {
    Alert.alert('Delete Goal', `Remove "${goal.name}"? All deposits will be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goal.id) },
    ]);
  }

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: isComplete ? goal.color + '66' : theme.border,
          borderWidth: isComplete ? 1.5 : 1,
        },
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: goal.color + '22' }]}>
          <Text style={styles.icon}>{goal.icon}</Text>
        </View>
        <View style={styles.nameWrap}>
          <Text style={[styles.name, { color: theme.text }]}>{goal.name}</Text>
          {days !== null && (
            <Text style={[styles.deadline, { color: days < 7 ? theme.error : theme.textMuted }]}>
              {days <= 0 ? 'Deadline passed' : `${days}d left`}
            </Text>
          )}
        </View>
        {isComplete && <Text style={[styles.done, { color: theme.primary }]}>✓ Done</Text>}
      </View>

      <ProgressBar progress={progress} color={goal.color} height={7} />

      <View style={styles.amounts}>
        <Text style={[styles.current, { color: goal.color }]}>
          {formatCurrency(goal.currentAmount, currencySymbol)}
        </Text>
        <Text style={[styles.target, { color: theme.textMuted }]}>
          of {formatCurrency(goal.targetAmount, currencySymbol)}
        </Text>
      </View>

      {!isComplete && (
        <TouchableOpacity
          style={[styles.depositBtn, { backgroundColor: goal.color + '22', borderColor: goal.color + '44' }]}
          onPress={() => onDeposit(goal)}
          activeOpacity={0.75}>
          <Text style={[styles.depositLabel, { color: goal.color }]}>+ Add Deposit</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  nameWrap: { flex: 1 },
  name: { fontSize: FontSize.lg, fontWeight: '600' },
  deadline: { fontSize: FontSize.sm, marginTop: 1 },
  done: { fontSize: FontSize.sm, fontWeight: '700' },
  amounts: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  current: { fontSize: FontSize.xl, fontWeight: '700' },
  target: { fontSize: FontSize.md },
  depositBtn: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  depositLabel: { fontSize: FontSize.sm, fontWeight: '600' },
});
