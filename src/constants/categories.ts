import { Category } from '@/types';

export const FALLBACK_CATEGORY_COLOR = '#6B7280';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#F59E0B', isDefault: true },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#60A5FA', isDefault: true },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#C084FC', isDefault: true },
  { id: 'health', name: 'Health', icon: '💊', color: '#F87171', isDefault: true },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FB7185', isDefault: true },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#94A3B8', isDefault: true },
  { id: 'housing', name: 'Housing / Rent', icon: '🏠', color: '#34D399', isDefault: true },
  { id: 'education', name: 'Education', icon: '📚', color: '#38BDF8', isDefault: true },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: '#A78BFA', isDefault: true },
  { id: 'other', name: 'Other', icon: '📦', color: '#6B7280', isDefault: true },
];

export const CATEGORY_COLOR_SWATCHES = [
  '#F59E0B', '#F87171', '#FB7185', '#C084FC',
  '#A78BFA', '#60A5FA', '#38BDF8', '#34D399',
  '#4ADE80', '#94A3B8', '#6B7280', '#10B981',
];
