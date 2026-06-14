import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  EXPENSES: 'fortuna:expenses',
  CATEGORIES: 'fortuna:categories',
  SAVINGS_GOALS: 'fortuna:savings_goals',
  SAVINGS_DEPOSITS: 'fortuna:savings_deposits',
  SETTINGS: 'fortuna:settings',
  ONBOARDED: 'fortuna:onboarded',
} as const;

export async function storageGetList<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

export async function storageSetList<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function storageGetItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function storageSetItem<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function storageClear(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
