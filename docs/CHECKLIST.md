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
- [x] Configure app.json (splash color → #070C07, scheme → fortuna, datetimepicker + sharing plugins)

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
  - [x] Optional deadline date (native DateTimePicker)
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
  - [x] Export data (CSV via expo-sharing)
- [x] Settings persisted via AsyncStorage

---

## 7. UX Polish (Nice-to-Have — We Will Implement These)

### Interactions & Feedback
- [x] Haptic feedback on primary actions (add expense, save goal, delete, errors)
- [x] Swipe-to-delete on expense items
- [x] Pull-to-refresh on all list screens (expenses, savings, dashboard)
- [x] Skeleton loading placeholders while data loads
- [x] Toast/snackbar notifications for success and error states
- [x] Smooth animated transitions between tabs

### Data Visualization
- [x] Pie/donut chart for expense category breakdown (react-native-svg)
- [x] Monthly trend line chart (spend over last 6 months)
- [ ] Spending heat-map calendar view
- [x] Budget ring / radial progress (Fortune Score radial ring)

### Financial Intelligence (Be the Best Financial Advisor)
- [x] Spending insights: MoM comparison, top category concentration warning
- [x] Budget warnings: balance hero turns red when over budget, bar fills red at 90%+
- [ ] Per-category monthly budget limits
- [x] Monthly budget report card (S/A/B/C/D/F grade in Fortune Score)
- [x] "Fortune Score" — 0–100 score: savings rate (40pts) + budget adherence (30pts) + diversity (15pts) + goals (15pts)
- [ ] Year-in-review summary (December special screen)
- [x] Projected savings date calculator

### Expense Enhancements
- [ ] Recurring expense templates (daily, weekly, monthly)
- [ ] Receipt photo capture and attachment (expo-image-picker)
- [ ] Multi-currency support with real-time conversion
- [ ] Income tracking alongside expenses
- [ ] Net worth tracker (assets − liabilities)
- [ ] Bill reminders with push notifications
- [x] Expense search (by description) + filter by category
- [ ] Bulk delete / edit expenses

### Savings Enhancements
- [x] Confetti animation when a savings goal is completed 🎉
- [ ] Round-up savings (e.g., round every expense to nearest 50, save the difference)
- [ ] Auto-savings rules ("save 10% of every income entry")
- [ ] Multiple savings "jars" within one goal

### Data & Sync
- [x] Cloud sync via Supabase (email auth sign-in / sign-up screens built)
- [ ] Multi-device sync (requires RLS + userId column on tables)
- [x] Offline-first with background sync (AsyncStorage primary, API routes ready)
- [x] Data export as CSV (via expo-sharing)
- [ ] Scheduled monthly email report

### Personalization
- [x] Dark / Light mode (follows system — automatic)
- [x] Fortuna quotes / affirmations on the dashboard (12 Latin quotes with translations, rotates daily)
- [x] Custom accent color (choose from palette)
- [x] Onboarding flow for new users (3-step: welcome → name + currency → first goal)
- [ ] App icon variants

### Security
- [ ] Biometric lock (Face ID / fingerprint) before showing financial data
- [ ] PIN code fallback

### Platform Extras
- [ ] iOS widget for quick balance view
- [ ] Android home screen shortcut for "Log Expense"
- [x] Share expense summary as image/card

---

## 8. Database & Backend Setup

> Architecture: mobile app (AsyncStorage offline-first) ↔ Expo Router API routes (server) ↔ Prisma ↔ Supabase PostgreSQL

### 8a. Environment & Security
- [x] Add `.env` to `.gitignore` (never commit secrets)
- [x] Create `.env` with all required keys (user fills in values)
- [x] Create `.env.example` as a safe committed reference template
- [x] Verify `.env` is not tracked by git

### 8b. Prisma Setup
- [x] Install `prisma@5.22.0` and `@prisma/client@5.22.0` (stable, matches tara-laro)
- [x] Configure `prisma/schema.prisma` with `DATABASE_URL` + `DIRECT_URL` (pgBouncer-safe)
- [x] Define all models matching app TypeScript types:
  - [x] `Category` (id, name, icon, color, isDefault, createdAt)
  - [x] `Expense` (id, amount, description, categoryId → Category, date, notes, createdAt)
  - [x] `SavingsGoal` (id, name, targetAmount, currentAmount, deadline?, icon, color, createdAt)
  - [x] `SavingsDeposit` (id, goalId → SavingsGoal cascade, amount, date, notes, createdAt)
  - [x] `AppSettings` (id, userName, currency, currencySymbol, monthlyBudget?, updatedAt)
- [x] Cascade deletes: deleting a goal deletes its deposits
- [x] Create `src/lib/prisma.ts` — singleton Prisma client (dev-safe, no duplicate connections)
- [ ] **User runs:** `npx prisma migrate dev --name init` to push schema to Supabase
- [ ] **User runs:** `npx prisma generate` to generate the typed client

### 8c. Supabase Client
- [x] Create `src/lib/supabase.ts` — typed Supabase client using env vars
- [x] Import `react-native-url-polyfill/auto` at app entry point (required for Supabase on RN)
- [x] Add `AsyncStorage` as Supabase auth storage adapter

### 8d. Expo Router API Routes (server-side endpoints)
- [x] `src/app/api/expenses+api.ts` — GET (list), POST (create)
- [x] `src/app/api/expenses/[id]+api.ts` — DELETE
- [x] `src/app/api/categories+api.ts` — GET (list), POST (create); seeds defaults on first call
- [x] `src/app/api/categories/[id]+api.ts` — DELETE (blocks default categories)
- [x] `src/app/api/savings/goals+api.ts` — GET, POST
- [x] `src/app/api/savings/goals/[id]+api.ts` — DELETE (cascade via schema)
- [x] `src/app/api/savings/deposits+api.ts` — POST (Prisma transaction: create deposit + increment goal)
- [x] `src/app/api/settings+api.ts` — GET (auto-creates defaults), PUT
- [x] All routes use Prisma client (server only — never imported in RN bundle)
- [x] All routes return consistent `{ data, error }` response shape
- [x] Input validation on all POST/PUT routes

### 8e. Sync Layer (mobile ↔ server)
- [ ] Create `src/lib/sync.ts` — sync local AsyncStorage data to server via API routes
- [ ] On app start: fetch server state and merge with local (server wins on conflict)
- [ ] On mutation: optimistically update AsyncStorage, then POST to API route
- [ ] Handle offline gracefully — queue failed requests and retry on reconnect
- [ ] Add `useSync` hook that exposes sync status (idle / syncing / error)
- [ ] Show sync indicator in Settings screen

### 8f. Authentication (optional, enables multi-device sync)
- [x] Supabase email + password sign-up / sign-in
- [x] `src/app/auth/sign-in.tsx` — sign-in screen
- [x] `src/app/auth/sign-up.tsx` — sign-up screen
- [ ] Auth gate in root layout — redirect to sign-in if not authenticated
- [ ] Row-level security (RLS) on all Supabase tables (user can only see their own data)
- [x] Store session in AsyncStorage via Supabase auth adapter

---

## 9. Technical

- [x] TanStack Query for all data fetching and mutation
- [x] AsyncStorage as offline-first persistence layer
- [x] Supabase client configured (future cloud sync)
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
| Settings | ✅ Done |
| Database & Backend | 🔄 In Progress (RLS + userId pending) |
| UX Polish | 🔄 In Progress (heat-map, per-cat budgets, year-in-review, recurring, multi-currency, income/net-worth, bulk-edit, widget remaining) |
| Technical | 🔄 In Progress (error boundaries, perf, tests remaining) |
