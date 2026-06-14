import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { STORAGE_KEYS, storageGetList, storageSetList } from '@/lib/storage';
import { generateId, getCurrentMonthKey, getMonthKey } from '@/lib/utils';
import { Category, Expense } from '@/types';

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => storageGetList<Expense>(STORAGE_KEYS.EXPENSES),
  });
}

export function useCurrentMonthExpenses() {
  const { data: expenses = [], ...rest } = useExpenses();
  const current = getCurrentMonthKey();
  return {
    ...rest,
    data: expenses.filter((e) => getMonthKey(e.date) === current),
  };
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (expense: Omit<Expense, 'id'>) => {
      const list = await storageGetList<Expense>(STORAGE_KEYS.EXPENSES);
      const newItem: Expense = { ...expense, id: generateId() };
      await storageSetList(STORAGE_KEYS.EXPENSES, [newItem, ...list]);
      return newItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await storageGetList<Expense>(STORAGE_KEYS.EXPENSES);
      await storageSetList(
        STORAGE_KEYS.EXPENSES,
        list.filter((e) => e.id !== id)
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Expense) => {
      const list = await storageGetList<Expense>(STORAGE_KEYS.EXPENSES);
      await storageSetList(
        STORAGE_KEYS.EXPENSES,
        list.map((e) => (e.id === updated.id ? updated : e))
      );
      return updated;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useTopCategories(limit = 3) {
  const { data: expenses = [], isLoading } = useCurrentMonthExpenses();

  const totals: Record<string, number> = {};
  for (const e of expenses) {
    totals[e.categoryId] = (totals[e.categoryId] ?? 0) + e.amount;
  }

  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const sorted = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
    }));

  return { data: sorted, grandTotal, isLoading };
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const stored = await storageGetList<Category>(STORAGE_KEYS.CATEGORIES);
      if (stored.length === 0) {
        await storageSetList(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return stored;
    },
  });
}

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'isDefault'>) => {
      const list = await storageGetList<Category>(STORAGE_KEYS.CATEGORIES);
      const newItem: Category = { ...category, id: generateId(), isDefault: false };
      await storageSetList(STORAGE_KEYS.CATEGORIES, [...list, newItem]);
      return newItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Category) => {
      const list = await storageGetList<Category>(STORAGE_KEYS.CATEGORIES);
      await storageSetList(
        STORAGE_KEYS.CATEGORIES,
        list.map((c) => (c.id === updated.id ? updated : c))
      );
      return updated;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await storageGetList<Category>(STORAGE_KEYS.CATEGORIES);
      await storageSetList(
        STORAGE_KEYS.CATEGORIES,
        list.filter((c) => c.id !== id)
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
