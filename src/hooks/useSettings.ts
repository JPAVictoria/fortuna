import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { STORAGE_KEYS, storageGetItem, storageSetItem } from '@/lib/storage';
import { AppSettings } from '@/types';

export const DEFAULT_CURRENCY_SYMBOL = '₱';

const DEFAULT_SETTINGS: AppSettings = {
  userName: 'You',
  currency: 'PHP',
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
};

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const stored = await storageGetItem<AppSettings>(STORAGE_KEYS.SETTINGS);
      return stored ?? DEFAULT_SETTINGS;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<AppSettings>) => {
      const current = await storageGetItem<AppSettings>(STORAGE_KEYS.SETTINGS);
      const next: AppSettings = { ...(current ?? DEFAULT_SETTINGS), ...updates };
      await storageSetItem(STORAGE_KEYS.SETTINGS, next);
      return next;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
