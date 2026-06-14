export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export type Expense = {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  notes?: string;
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
