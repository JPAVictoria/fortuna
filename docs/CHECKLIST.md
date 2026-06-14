# Fortuna — Feature Checklist

> Fortuna was the Roman goddess of fortune, luck, fate, and prosperity.  
> This app helps you command your finances like a Roman emperor.

Legend: `[ ]` todo · `[x]` done · `[~]` in progress

---

## 0. Project Setup

- [x] Initialize Expo SDK 56 project
- [ ] Install all dependencies (`@react-native-async-storage/async-storage`, `@supabase/supabase-js`, `@tanstack/react-query`, `nativewind`, `tailwindcss`, `react-native-svg`, `expo-image-picker`, `react-native-url-polyfill`, `dotenv`, `prisma`, `tsx`, `ws`)
- [ ] Set up folder structure (components, hooks, lib, types, providers, constants)
- [ ] Define Fortuna design system (emerald green palette, typography, spacing, border-radius)
- [ ] Define TypeScript types (Category, Expense, SavingsGoal, SavingsDeposit, AppSettings)
- [ ] Set up AsyncStorage data layer (`lib/storage.ts`)
- [ ] Set up utility functions (`lib/utils.ts` — formatCurrency, formatDate, groupByDate, generateId)
- [ ] Set up default categories (`constants/categories.ts`)
- [ ] Set up TanStack Query provider (`providers/QueryProvider.tsx`)
- [ ] Update README with full codebase guide
- [ ] Configure app.json (splash color, scheme, app name)

---

## 1. Navigation & Layout

- [ ] Root Stack layout with modal support (`app/_layout.tsx`)
- [ ] Bottom tab navigator with 4 tabs: Dashboard, Expenses, Savings, Settings (`app/(tabs)/_layout.tsx`)
- [ ] Emerald-themed tab bar (active/inactive states, icon + label)
- [ ] Safe area handling across all screens

---

## 2. Expense Logging

- [ ] **Add Expense modal** (`app/add-expense.tsx`)
  - [ ] Amount input (numeric keyboard, currency-formatted)
  - [ ] Description input
  - [ ] Category picker (horizontal scroll of chips, tap to select)
  - [ ] Date (defaults to today)
  - [ ] Optional notes field
  - [ ] Submit + validation (amount > 0, category selected, description filled)
- [ ] **Expenses list screen** (`app/(tabs)/expenses.tsx`)
  - [ ] Monthly total card at top
  - [ ] Expenses grouped by date (Today, Yesterday, earlier dates)
  - [ ] Each row: category icon + name, description, formatted amount, date
  - [ ] Empty state when no expenses
  - [ ] Floating action button (+) to open Add Expense modal
- [ ] **Expense item component** with swipe-to-delete or long-press menu
- [ ] **Category badge** component (color-coded pill)
- [ ] Delete expense with confirmation

---

## 3. Expense Categories (Creatable)

- [ ] **Default categories** pre-seeded on first launch:
  - 🍽️ Food & Dining
  - 🚗 Transport
  - 🛍️ Shopping
  - 💊 Health
  - 🎬 Entertainment
  - 💡 Utilities
  - 🏠 Housing / Rent
  - 📚 Education
  - 📱 Subscriptions
  - 📦 Other
- [ ] **Add Category modal** (`app/add-category.tsx`)
  - [ ] Name input
  - [ ] Emoji icon input
  - [ ] Color swatch picker (8 preset colors)
  - [ ] Validation + save
- [ ] **Category management in Settings** — list all categories, add new, delete custom

---

## 4. Dashboard

- [ ] **Dashboard screen** (`app/(tabs)/index.tsx`)
  - [ ] Greeting header ("Good morning/afternoon/evening + name" + current month)
  - [ ] Hero balance card:
    - Total spent this month (large, prominent)
    - Total saved this month
    - Remaining budget (if monthly budget set)
  - [ ] Quick action buttons: "+ Add Expense" · "+ Add Savings"
  - [ ] **Top 3 Expense Categories** chart:
    - Category icon, name, amount, percentage bar
    - Only shows current month's data
  - [ ] **Recent Transactions** (last 5):
    - Category icon, description, amount, date
    - "View All" link to expenses screen
  - [ ] Empty state for first-time users

---

## 5. Savings

- [ ] **Savings screen** (`app/(tabs)/savings.tsx`)
  - [ ] Total savings summary card (gold-themed)
  - [ ] List of savings goals as cards
  - [ ] Empty state with prompt to create first goal
  - [ ] FAB to create new goal
- [ ] **Savings Goal card** (`components/savings/SavingsGoalCard.tsx`)
  - [ ] Goal name + icon
  - [ ] Progress bar (current / target)
  - [ ] Amount: saved vs target
  - [ ] Deadline countdown (if set)
  - [ ] "+ Add Deposit" button per goal
- [ ] **Add Savings Goal modal** (`app/add-goal.tsx`)
  - [ ] Goal name
  - [ ] Target amount
  - [ ] Icon (emoji)
  - [ ] Color (swatches)
  - [ ] Optional deadline date
- [ ] **Add Deposit modal** (`app/add-deposit.tsx`)
  - [ ] Amount input
  - [ ] Auto-linked to the goal
  - [ ] Optional notes
- [ ] Goal completion state (visual celebration when 100% reached)

---

## 6. Settings

- [ ] **Settings screen** (`app/(tabs)/settings.tsx`)
  - [ ] Profile section: display name, currency selector
  - [ ] Monthly budget field (used for budget remaining in dashboard)
  - [ ] Categories section: list + manage + add new
  - [ ] Data section: export, clear all data (with confirmation)
  - [ ] App version display
- [ ] Settings persisted via AsyncStorage

---

## 7. UX Polish (Nice-to-Have — We Will Implement These)

### Interactions & Feedback
- [ ] Haptic feedback on primary actions (add expense, save goal)
- [ ] Swipe-to-delete on expense items (with undo snackbar)
- [ ] Pull-to-refresh on all list screens
- [ ] Skeleton loading placeholders while data loads
- [ ] Toast/snackbar notifications for success and error states
- [ ] Smooth animated transitions between tabs

### Data Visualization
- [ ] Pie/donut chart for expense category breakdown (react-native-svg)
- [ ] Monthly trend line chart (spend over last 6 months)
- [ ] Spending heat-map calendar view
- [ ] Budget ring / radial progress on dashboard

### Financial Intelligence (Be the Best Financial Advisor)
- [ ] Spending insights: "You spent 32% more on food than last month"
- [ ] Budget warnings: alert when approaching/exceeding category budget
- [ ] Per-category monthly budget limits
- [ ] Monthly budget report card (A/B/C/D grade based on savings rate)
- [ ] "Fortune Score" — overall financial health score (0–100) based on: savings rate, budget adherence, expense diversity
- [ ] Year-in-review summary (December special screen)
- [ ] Projected savings date calculator: "At this rate, you'll hit your goal by [date]"

### Expense Enhancements
- [ ] Recurring expense templates (daily, weekly, monthly)
- [ ] Receipt photo capture and attachment (expo-image-picker)
- [ ] Multi-currency support with real-time conversion
- [ ] Income tracking alongside expenses
- [ ] Net worth tracker (assets − liabilities)
- [ ] Bill reminders with push notifications
- [ ] Expense search and filter (by category, date range, amount)
- [ ] Bulk delete / edit expenses

### Savings Enhancements
- [ ] Confetti animation when a savings goal is completed 🎉
- [ ] Round-up savings (e.g., round every expense to nearest 50, save the difference)
- [ ] Auto-savings rules ("save 10% of every income entry")
- [ ] Multiple savings "jars" within one goal

### Data & Sync
- [ ] Cloud sync via Supabase (sign in with Google/email)
- [ ] Multi-device sync
- [ ] Offline-first with background sync
- [ ] Data export as CSV or JSON
- [ ] Scheduled monthly email report

### Personalization
- [ ] Dark / Light mode toggle in Settings
- [ ] Fortuna quotes / affirmations on the dashboard (Roman philosophy + financial wisdom)
- [ ] Custom accent color (choose from palette)
- [ ] Onboarding flow for new users (3-step: name → currency → first goal)
- [ ] App icon variants

### Security
- [ ] Biometric lock (Face ID / fingerprint) before showing financial data
- [ ] PIN code fallback

### Platform Extras
- [ ] iOS widget for quick balance view
- [ ] Android home screen shortcut for "Log Expense"
- [ ] Share expense summary as image/card

---

## 8. Technical

- [ ] TanStack Query for all data fetching and mutation
- [ ] AsyncStorage as offline-first persistence layer
- [ ] Supabase client configured (future cloud sync)
- [ ] TypeScript strict mode throughout
- [ ] Proper error boundaries
- [ ] Expo Router typed routes
- [ ] Performance: `React.memo` on list items, `useCallback` on handlers
- [ ] Unit tests for utility functions (formatCurrency, groupByDate)
- [ ] E2E test: log expense → appears on dashboard

---

## Progress Tracker

| Area | Status |
|---|---|
| Project Setup | 🔄 In Progress |
| Navigation | ⬜ Not Started |
| Expense Logging | ⬜ Not Started |
| Categories | ⬜ Not Started |
| Dashboard | ⬜ Not Started |
| Savings | ⬜ Not Started |
| Settings | ⬜ Not Started |
| UX Polish | ⬜ Not Started |
| Technical | ⬜ Not Started |
