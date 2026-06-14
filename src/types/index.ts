export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  monthlyBudget?: number;
};

export type Expense = {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  notes?: string;
  photoUri?: string;
};

export type Income = {
  id: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
};

export type RecurringExpense = {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDue: string;
  notes?: string;
  active: boolean;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  createdAt: string;
};

export type SavingsDeposit = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  notes?: string;
};

export type AppSettings = {
  userName: string;
  monthlyBudget?: number;
  accentColor?: string;
};
