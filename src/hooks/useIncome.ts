import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { STORAGE_KEYS, storageGetList, storageSetList } from '@/lib/storage';
import { generateId, getCurrentMonthKey, getMonthKey } from '@/lib/utils';
import { Income } from '@/types';

export function useIncome() {
  return useQuery({
    queryKey: ['income'],
    queryFn: () => storageGetList<Income>(STORAGE_KEYS.INCOME),
  });
}

export function useCurrentMonthIncome() {
  const { data: income = [], ...rest } = useIncome();
  const current = getCurrentMonthKey();
  return {
    ...rest,
    data: income.filter(i => getMonthKey(i.date) === current),
  };
}

export function useMonthlyIncomeTotals(monthCount = 6) {
  const { data: income = [], isLoading } = useIncome();
  const data = useMemo(() => {
    const now = new Date();
    return Array.from({ length: monthCount }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const total = income.filter(inc => inc.date.startsWith(key)).reduce((s, inc) => s + inc.amount, 0);
      return { key, label, total };
    });
  }, [income, monthCount]);
  return { data, isLoading };
}

export function useAddIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (income: Omit<Income, 'id'>) => {
      const list = await storageGetList<Income>(STORAGE_KEYS.INCOME);
      const newItem: Income = { ...income, id: generateId() };
      await storageSetList(STORAGE_KEYS.INCOME, [newItem, ...list]);
      return newItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['income'] }),
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await storageGetList<Income>(STORAGE_KEYS.INCOME);
      await storageSetList(STORAGE_KEYS.INCOME, list.filter(i => i.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['income'] }),
  });
}
