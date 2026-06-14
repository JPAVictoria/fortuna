import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { STORAGE_KEYS, storageGetList, storageSetList } from '@/lib/storage';
import { generateId, todayISO } from '@/lib/utils';
import { RecurringExpense } from '@/types';

export function useRecurringExpenses() {
  return useQuery({
    queryKey: ['recurring'],
    queryFn: () => storageGetList<RecurringExpense>(STORAGE_KEYS.RECURRING_EXPENSES),
  });
}

export function useDueRecurring() {
  const { data: recurring = [], ...rest } = useRecurringExpenses();
  const today = todayISO().substring(0, 10);
  return {
    ...rest,
    data: recurring.filter(r => r.active && r.nextDue <= today),
  };
}

function nextDueDate(from: string, frequency: RecurringExpense['frequency']): string {
  const d = new Date(from);
  if (frequency === 'daily') d.setDate(d.getDate() + 1);
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export function useAddRecurring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<RecurringExpense, 'id'>) => {
      const list = await storageGetList<RecurringExpense>(STORAGE_KEYS.RECURRING_EXPENSES);
      const newItem: RecurringExpense = { ...item, id: generateId() };
      await storageSetList(STORAGE_KEYS.RECURRING_EXPENSES, [...list, newItem]);
      return newItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  });
}

export function useApplyRecurring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await storageGetList<RecurringExpense>(STORAGE_KEYS.RECURRING_EXPENSES);
      const item = list.find(r => r.id === id);
      if (!item) return;
      await storageSetList(
        STORAGE_KEYS.RECURRING_EXPENSES,
        list.map(r => r.id === id ? { ...r, nextDue: nextDueDate(r.nextDue, r.frequency) } : r)
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  });
}

export function useDeleteRecurring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await storageGetList<RecurringExpense>(STORAGE_KEYS.RECURRING_EXPENSES);
      await storageSetList(STORAGE_KEYS.RECURRING_EXPENSES, list.filter(r => r.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  });
}
