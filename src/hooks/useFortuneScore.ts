import { useMemo } from 'react';

import { useCurrentMonthExpenses } from './useExpenses';
import { useSavingsGoals, useTotalSaved } from './useSavings';
import { useSettings } from './useSettings';

export type FortuneScore = {
  total: number;            // 0–100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  savingsRate: number;      // 0–40
  budgetScore: number;      // 0–30
  diversityScore: number;   // 0–15
  goalsScore: number;       // 0–15
  insight: string;
};

export function useFortuneScore(): FortuneScore {
  const { data: expenses = [] } = useCurrentMonthExpenses();
  const { data: goals = [] } = useSavingsGoals();
  const { total: totalSaved } = useTotalSaved();
  const { data: settings } = useSettings();

  return useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const budget = settings?.monthlyBudget ?? 0;

    // Savings rate score (0–40): reward saving ≥20% of budget
    const savingsBase = budget > 0 ? totalSaved / budget : 0;
    const savingsRate = Math.min(40, Math.round(savingsBase * 200));

    // Budget adherence score (0–30): penalise overspend
    let budgetScore = 30;
    if (budget > 0 && totalSpent > 0) {
      const ratio = totalSpent / budget;
      if (ratio > 1) budgetScore = Math.max(0, 30 - Math.round((ratio - 1) * 60));
      else budgetScore = Math.min(30, Math.round((1 - ratio) * 30 + 15));
    }

    // Category diversity score (0–15): penalise if one category > 60% of spend
    let diversityScore = 15;
    if (totalSpent > 0) {
      const catTotals: Record<string, number> = {};
      for (const e of expenses) catTotals[e.categoryId] = (catTotals[e.categoryId] ?? 0) + e.amount;
      const maxShare = Math.max(...Object.values(catTotals)) / totalSpent;
      if (maxShare > 0.6) diversityScore = Math.max(0, 15 - Math.round((maxShare - 0.6) * 37.5));
    }

    // Goals score (0–15): reward having active goals with progress
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount);
    const goalsScore = Math.min(15, activeGoals.length * 4 + completedGoals.length * 7);

    const total = Math.min(100, savingsRate + budgetScore + diversityScore + goalsScore);

    const grade =
      total >= 90 ? 'S' :
      total >= 75 ? 'A' :
      total >= 60 ? 'B' :
      total >= 45 ? 'C' :
      total >= 30 ? 'D' : 'F';

    const insight =
      total >= 90 ? 'Fortuna smiles upon you. Your finances are exemplary.' :
      total >= 75 ? 'Strong command of your wealth. Keep the momentum.' :
      total >= 60 ? 'Good foundation. Trim spending to reach the next level.' :
      total >= 45 ? 'Room to grow. Set a savings goal to boost your score.' :
      total >= 30 ? 'Your fortune needs attention. Review your top expenses.' :
      'The goddess demands action. Start with a budget and one savings goal.';

    return { total, grade, savingsRate, budgetScore, diversityScore, goalsScore, insight };
  }, [expenses, goals, totalSaved, settings]);
}
