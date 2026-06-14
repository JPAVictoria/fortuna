# Fortuna — Feature Checklist

> Fortuna was the Roman goddess of fortune, luck, fate, and prosperity.  
> This app helps you command your finances like a Roman emperor.

Legend: `[ ]` todo · `[x]` done · `[~]` in progress

---

## 0. Project Setup

- [x] Initialize Expo SDK 56 project
- [x] Install all dependencies (`@react-native-async-storage/async-storage`, `@supabase/supabase-js`, `@tanstack/react-query`, `nativewind`, `tailwindcss`, `react-native-svg`, `expo-image-picker`, `react-native-url-polyfill`, `dotenv`)
- [x] Set up folder structure (components, hooks, lib, types, providers, constants)
- [x] Define Fortuna design system (emerald green palette, typography, spacing, border-radius)
- [x] Define TypeScript types (Category, Expense, SavingsGoal, SavingsDeposit, AppSettings)
- [x] Set up AsyncStorage data layer (`lib/storage.ts`)
- [x] Set up utility functions (`lib/utils.ts` — formatCurrency, formatDate, groupByDate, generateId)
- [x] Set up default categories (`constants/categories.ts`)
- [x] Set up TanStack Query provider (`providers/QueryProvider.tsx`)
- [x] Update README with full codebase guide
- [ ] Configure app.json (splash color, scheme, app name)

---

## 1. Navigation & Layout

- [x] Root Stack layout with modal support (`app/_layout.tsx`)
- [x] Bottom tab navigator with 4 tabs: Dashboard, Expenses, Savings, Settings (`app/(tabs)/_layout.tsx`)
- [x] Emerald-themed tab bar (active/inactive states, icon + label)
- [x] Safe area handling across all screens

---

## 2. Expense Logging

- [x] **Add Expense modal** (`app/add-expense.tsx`)
  - [x] Amount input (numeric keyboard, currency-formatted)
  - [x] Description input
  - [x] Category picker (horizontal scroll of chips, tap to select)
  - [x] Date (defaults to today)
  - [x] Optional notes field
  - [x] Submit + validation (amount > 0, category selected, description filled)
- [x] **Expenses list screen** (`app/(tabs)/expenses.tsx`)
  - [x] Monthly total card at top
  - [x] Expenses grouped by date (Today, Yesterday, earlier dates)
  - [x] Each row: category icon + name, description, formatted amount, date
  - [x] Empty state when no expenses
  - [x] Floating action button (+) to open Add Expense modal
- [x] **Expense item component** with long-press delete menu
- [x] **Category badge** component (color-coded pill)
- [x] Delete expense with confirmation

---

## 3. Expense Categories (Creatable)

- [x] **Default categories** pre-seeded on first launch:
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
- [x] **Add Category modal** (`app/add-category.tsx`)
  - [x] Name input
  - [x] Emoji icon input (grid + custom text)
  - [x] Color swatch picker (12 preset colors)
  - [x] Live preview badge + validation + save
- [x] **Category management in Settings** — list all categories, add new, delete custom

---

## 4. Dashboard

- [x] **Dashboard screen** (`app/(tabs)/index.tsx`)
  - [x] Greeting header ("Good morning/afternoon/evening + name" + current month)
  - [x] Hero balance card:
    - Total spent this month (large, prominent)
    - Total saved this month
    - Remaining budget (if monthly budget set)
  - [x] Quick action buttons: "+ Add Expense" · "+ Save Money"
  - [x] **Top 3 Expense Categories** chart:
    - Category icon, name, amount, percentage bar
    - Only shows current month's data
  - [x] **Recent Transactions** (last 5):
    - Category icon, description, amount, date
    - "View All" link to expenses screen
  - [x] Empty state for first-time users

---

## 5. Savings

- [x] **Savings screen** (`app/(tabs)/savings.tsx`)
  - [x] Total savings summary card (gold-themed)
  - [x] List of savings goals as cards
  - [x] Empty state with prompt to create first goal
  - [x] FAB to create new goal
- [x] **Savings Goal card** (`components/savings/SavingsGoalCard.tsx`)
  - [x] Goal name + icon
  - [x] Progress bar (current / target)
  - [x] Amount: saved vs target
  - [x] Deadline countdown (if set)
  - [x] "+ Add Deposit" button per goal
- [x] **Add Savings Goal modal** (`app/add-goal.tsx`)
  - [x] Goal name
  - [x] Target amount
  - [x] Icon (emoji grid)
  - [x] Color (swatches) + live preview
  - [ ] Optional deadline date
- [x] **Add Deposit modal** (`app/add-deposit.tsx`)
  - [x] Amount input
  - [x] Auto-linked to the goal (via route params)
  - [x] Optional notes
- [x] Goal completion state (visual "Done ✓" badge when 100% reached)

---

## 6. Settings

- [x] **Settings screen** (`app/(tabs)/settings.tsx`)
  - [x] Profile section: display name, monthly budget field
  - [x] Currency selector (PHP, USD, EUR, SGD, JPY)
  - [x] Monthly budget field (used for budget remaining in dashboard)
  - [x] Categories section: list + manage + add new
  - [x] Data section: clear all data (with confirmation)
  - [x] App version display
  - [ ] Export data (CSV/JSON)
- [x] Settings persisted via AsyncStorage

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

- [x] TanStack Query for all data fetching and mutation
- [x] AsyncStorage as offline-first persistence layer
- [ ] Supabase client configured (future cloud sync)
- [x] TypeScript strict mode throughout
- [ ] Proper error boundaries
- [x] Expo Router typed routes
- [ ] Performance: `React.memo` on list items, `useCallback` on handlers
- [ ] Unit tests for utility functions (formatCurrency, groupByDate)
- [ ] E2E test: log expense → appears on dashboard

---

## Progress Tracker

| Area | Status |
|---|---|
| Project Setup | ✅ Done |
| Navigation | ✅ Done |
| Expense Logging | ✅ Done |
| Categories | ✅ Done |
| Dashboard | ✅ Done |
| Savings | ✅ Done |
| Settings | ✅ Done (export pending) |
| UX Polish | ⬜ Not Started |
| Technical | 🔄 In Progress |
