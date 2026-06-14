import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { STORAGE_KEYS, storageGetList, storageSetList } from '@/lib/storage';
import { generateId, todayISO } from '@/lib/utils';
import { SavingsDeposit, SavingsGoal } from '@/types';

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savings_goals'],
    queryFn: () => storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS),
  });
}

export function useSavingsDeposits(goalId?: string) {
  return useQuery({
    queryKey: ['savings_deposits', goalId],
    queryFn: async () => {
      const list = await storageGetList<SavingsDeposit>(STORAGE_KEYS.SAVINGS_DEPOSITS);
      return goalId ? list.filter((d) => d.goalId === goalId) : list;
    },
  });
}

export function useTotalSaved() {
  const { data: goals = [], isLoading } = useSavingsGoals();
  const total = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  return { total, isLoading };
}

export function useAddSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt'>) => {
      const list = await storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS);
      const newGoal: SavingsGoal = {
        ...goal,
        id: generateId(),
        currentAmount: 0,
        createdAt: todayISO(),
      };
      await storageSetList(STORAGE_KEYS.SAVINGS_GOALS, [...list, newGoal]);
      return newGoal;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savings_goals'] }),
  });
}

export function useAddDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalId,
      amount,
      notes,
    }: {
      goalId: string;
      amount: number;
      notes?: string;
    }) => {
      const [goals, deposits] = await Promise.all([
        storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS),
        storageGetList<SavingsDeposit>(STORAGE_KEYS.SAVINGS_DEPOSITS),
      ]);

      const newDeposit: SavingsDeposit = {
        id: generateId(),
        goalId,
        amount,
        date: todayISO(),
        notes,
      };

      const updatedGoals = goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      );

      await Promise.all([
        storageSetList(STORAGE_KEYS.SAVINGS_GOALS, updatedGoals),
        storageSetList(STORAGE_KEYS.SAVINGS_DEPOSITS, [newDeposit, ...deposits]),
      ]);

      return newDeposit;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings_goals'] });
      qc.invalidateQueries({ queryKey: ['savings_deposits'] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<SavingsGoal> & { id: string }) => {
      const list = await storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS);
      await storageSetList(
        STORAGE_KEYS.SAVINGS_GOALS,
        list.map((g) => (g.id === updated.id ? { ...g, ...updated } : g))
      );
      return updated;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['savings_goals'] }),
  });
}

export function useDeleteDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ depositId, goalId, amount }: { depositId: string; goalId: string; amount: number }) => {
      const [goals, deposits] = await Promise.all([
        storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS),
        storageGetList<SavingsDeposit>(STORAGE_KEYS.SAVINGS_DEPOSITS),
      ]);
      await Promise.all([
        storageSetList(
          STORAGE_KEYS.SAVINGS_DEPOSITS,
          deposits.filter((d) => d.id !== depositId)
        ),
        storageSetList(
          STORAGE_KEYS.SAVINGS_GOALS,
          goals.map((g) =>
            g.id === goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g
          )
        ),
      ]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings_goals'] });
      qc.invalidateQueries({ queryKey: ['savings_deposits'] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const [goals, deposits] = await Promise.all([
        storageGetList<SavingsGoal>(STORAGE_KEYS.SAVINGS_GOALS),
        storageGetList<SavingsDeposit>(STORAGE_KEYS.SAVINGS_DEPOSITS),
      ]);
      await Promise.all([
        storageSetList(
          STORAGE_KEYS.SAVINGS_GOALS,
          goals.filter((g) => g.id !== id)
        ),
        storageSetList(
          STORAGE_KEYS.SAVINGS_DEPOSITS,
          deposits.filter((d) => d.goalId !== id)
        ),
      ]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings_goals'] });
      qc.invalidateQueries({ queryKey: ['savings_deposits'] });
    },
  });
}
