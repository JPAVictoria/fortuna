export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatCurrency(amount: number, symbol = '₱'): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${symbol}${formatted}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMonth(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthKey(isoString: string): string {
  return isoString.substring(0, 7);
}

export function isCurrentMonth(isoString: string): boolean {
  return getMonthKey(isoString) === getCurrentMonthKey();
}

export function todayISO(): string {
  return new Date().toISOString();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function groupByDate<T extends { date: string }>(
  items: T[]
): { label: string; dateKey: string; items: T[] }[] {
  const groups: Record<string, T[]> = {};

  for (const item of items) {
    const key = item.date.substring(0, 10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  const today = new Date().toISOString().substring(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupItems]) => {
      let label: string;
      if (dateKey === today) label = 'Today';
      else if (dateKey === yesterday) label = 'Yesterday';
      else label = formatDate(dateKey);

      return { label, dateKey, items: groupItems };
    });
}

export function daysUntil(isoString: string): number {
  const target = new Date(isoString).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / 86400000);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
