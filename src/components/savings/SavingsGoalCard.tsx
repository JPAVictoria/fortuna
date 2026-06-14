import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/use-theme';
import { useDeleteSavingsGoal, useDeleteDeposit, useSavingsDeposits } from '@/hooks/useSavings';
import { daysUntil, formatCurrency, formatDateShort } from '@/lib/utils';
import { SavingsGoal } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Props = {
  goal: SavingsGoal;
  onDeposit: (goal: SavingsGoal) => void;
  currencySymbol?: string;
};

export function SavingsGoalCard({ goal, onDeposit, currencySymbol = DEFAULT_CURRENCY_SYMBOL }: Props) {
  const theme = useTheme();
  const { mutate: deleteGoal } = useDeleteSavingsGoal();
  const { mutate: deleteDeposit } = useDeleteDeposit();
  const { data: deposits = [] } = useSavingsDeposits(goal.id);
  const [expanded, setExpanded] = useState(false);

  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
  const isComplete = progress >= 1;
  const days = goal.deadline ? daysUntil(goal.deadline) : null;

  function handleLongPress() {
    Alert.alert(goal.name, undefined, [
      {
        text: 'Edit Goal',
        onPress: () => router.push({
          pathname: '/edit-goal',
          params: {
            id: goal.id,
            name: goal.name,
            targetAmount: String(goal.targetAmount),
            icon: goal.icon,
            color: goal.color,
            deadline: goal.deadline ?? '',
          },
        }),
      },
      {
        text: 'Delete Goal',
        style: 'destructive',
        onPress: () => Alert.alert('Delete Goal', `Remove "${goal.name}"? All deposits will be deleted.`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goal.id) },
        ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleDepositLongPress(depositId: string, amount: number) {
    Alert.alert('Delete Deposit', `Remove this deposit of ${formatCurrency(amount, currencySymbol)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDeposit({ depositId, goalId: goal.id, amount }),
      },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={() => setExpanded(e => !e)}
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
        <Text style={[styles.expandChevron, { color: theme.textMuted }]}>{expanded ? '▲' : '▼'}</Text>
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
          activeOpacity={0.75}
          accessibilityLabel={`Add deposit to ${goal.name}`}>
          <Text style={[styles.depositLabel, { color: goal.color }]}>+ Add Deposit</Text>
        </TouchableOpacity>
      )}

      {expanded && deposits.length > 0 && (
        <View style={[styles.historySection, { borderTopColor: theme.border }]}>
          <Text style={[styles.historyTitle, { color: theme.textMuted }]}>DEPOSIT HISTORY</Text>
          {deposits.map(d => (
            <TouchableOpacity
              key={d.id}
              onLongPress={() => handleDepositLongPress(d.id, d.amount)}
              style={[styles.depositRow, { borderBottomColor: theme.border }]}
              accessibilityLabel={`Deposit of ${formatCurrency(d.amount, currencySymbol)} on ${formatDateShort(d.date)}, long press to delete`}>
              <Text style={[styles.depositDate, { color: theme.textMuted }]}>{formatDateShort(d.date)}</Text>
              <Text style={[styles.depositAmount, { color: goal.color }]}>+{formatCurrency(d.amount, currencySymbol)}</Text>
              {d.notes ? <Text style={[styles.depositNotes, { color: theme.textMuted }]}>{d.notes}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {expanded && deposits.length === 0 && (
        <View style={[styles.historySection, { borderTopColor: theme.border }]}>
          <Text style={[styles.noDeposits, { color: theme.textMuted }]}>No deposits yet</Text>
        </View>
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
  expandChevron: { fontSize: FontSize.xs },
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
  historySection: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  historyTitle: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8, marginBottom: Spacing.xs },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  depositDate: { fontSize: FontSize.sm, flex: 1 },
  depositAmount: { fontSize: FontSize.sm, fontWeight: '700' },
  depositNotes: { fontSize: FontSize.xs },
  noDeposits: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.sm },
});
