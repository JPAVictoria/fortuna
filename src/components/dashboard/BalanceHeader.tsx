import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/lib/utils';

type Props = {
  totalSpent: number;
  totalSaved: number;
  monthlyBudget?: number;
  currencySymbol?: string;
};

export function BalanceHeader({
  totalSpent,
  totalSaved,
  monthlyBudget,
  currencySymbol = '₱',
}: Props) {
  const theme = useTheme();
  const remaining = monthlyBudget ? monthlyBudget - totalSpent : null;
  const budgetPct = monthlyBudget && monthlyBudget > 0 ? totalSpent / monthlyBudget : null;

  return (
    <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.emeraldBar, { backgroundColor: theme.primary }]} />

      <Text style={[styles.label, { color: theme.textSecondary }]}>SPENT THIS MONTH</Text>
      <Text style={[styles.total, { color: theme.text }]}>
        {formatCurrency(totalSpent, currencySymbol)}
      </Text>

      {budgetPct !== null && (
        <View style={styles.budgetTrack}>
          <View
            style={[
              styles.budgetFill,
              {
                width: `${Math.min(budgetPct * 100, 100)}%`,
                backgroundColor: budgetPct > 0.9 ? theme.error : theme.primary,
              },
            ]}
          />
        </View>
      )}

      <View style={styles.row}>
        <View style={[styles.stat, { backgroundColor: theme.primaryDim, borderRadius: BorderRadius.md }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>SAVED</Text>
          <Text style={[styles.statValue, { color: theme.primaryLight }]}>
            {formatCurrency(totalSaved, currencySymbol)}
          </Text>
        </View>

        {remaining !== null && (
          <View
            style={[
              styles.stat,
              {
                backgroundColor: remaining < 0 ? theme.errorDim : theme.primaryDim,
                borderRadius: BorderRadius.md,
              },
            ]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {remaining < 0 ? 'OVER BUDGET' : 'BUDGET LEFT'}
            </Text>
            <Text
              style={[
                styles.statValue,
                { color: remaining < 0 ? theme.error : theme.primaryLight },
              ]}>
              {formatCurrency(Math.abs(remaining), currencySymbol)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  emeraldBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  total: {
    fontSize: FontSize.display,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 50,
  },
  budgetTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: Spacing.xs,
  },
  budgetFill: { height: '100%', borderRadius: 2 },
  row: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  stat: {
    flex: 1,
    padding: Spacing.sm,
    gap: 2,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
