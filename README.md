# Fortuna 🌿

> *"Fortuna was the Roman goddess of fortune, luck, fate, and prosperity."*

Fortuna is a personal finance tracking mobile app built with Expo React Native. Track expenses, build savings goals, and command your finances with clarity and intention.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 56 (React Native 0.85) |
| Navigation | Expo Router v4 (file-based routing) |
| State / Data | TanStack Query v5 + AsyncStorage |
| Styling | StyleSheet API + Fortuna Design System |
| Backend (sync) | Supabase (offline-first, sync optional) |
| Language | TypeScript (strict) |

---

## Project Structure

```
fortuna/
├── src/
│   ├── app/                        # Expo Router screens
│   │   ├── _layout.tsx             # Root Stack (modals + tabs)
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx         # Bottom tab navigator
│   │   │   ├── index.tsx           # Dashboard
│   │   │   ├── expenses.tsx        # Expense log
│   │   │   ├── savings.tsx         # Savings goals
│   │   │   └── settings.tsx        # Settings & categories
│   │   ├── add-expense.tsx         # Modal — log an expense
│   │   ├── add-goal.tsx            # Modal — create savings goal
│   │   ├── add-deposit.tsx         # Modal — add money to goal
│   │   └── add-category.tsx        # Modal — create category
│   │
│   ├── components/
│   │   ├── ui/                     # Base design system components
│   │   │   ├── Button.tsx          # primary / secondary / ghost / danger
│   │   │   ├── Card.tsx            # Elevated surface card
│   │   │   ├── Input.tsx           # Labeled text input
│   │   │   ├── EmptyState.tsx      # Empty list placeholder
│   │   │   ├── ProgressBar.tsx     # Linear progress bar
│   │   │   └── FAB.tsx             # Floating action button
│   │   ├── dashboard/
│   │   │   ├── BalanceHeader.tsx   # Monthly total + savings hero card
│   │   │   ├── TopExpensesChart.tsx # Top 3 category bars
│   │   │   └── RecentTransactions.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseItem.tsx     # Single expense row
│   │   │   └── CategoryBadge.tsx   # Color-coded category pill
│   │   ├── savings/
│   │   │   └── SavingsGoalCard.tsx
│   │   └── settings/
│   │       └── CategoryItem.tsx
│   │
│   ├── constants/
│   │   ├── theme.ts                # Colors, spacing, border-radius, fonts
│   │   └── categories.ts           # 10 default expense categories
│   │
│   ├── hooks/
│   │   ├── useExpenses.ts          # CRUD for expenses
│   │   ├── useSavings.ts           # CRUD for goals + deposits
│   │   ├── useCategories.ts        # CRUD for categories
│   │   └── useSettings.ts          # Read/write app settings
│   │
│   ├── lib/
│   │   ├── storage.ts              # AsyncStorage typed wrapper
│   │   └── utils.ts                # formatCurrency, formatDate, groupByDate, generateId
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx       # TanStack QueryClient setup
│   │
│   └── types/
│       └── index.ts                # Shared TypeScript types
│
├── docs/
│   └── CHECKLIST.md                # Feature checklist (check off as implemented)
│
├── assets/
│   └── images/                     # App icons, splash
│
├── app.json                        # Expo config
├── tsconfig.json                   # TypeScript config (@ → src/)
└── package.json
```

---

## Design System

### Colors — Fortuna Palette

The app uses **emerald green** as the brand color, symbolizing prosperity. Gold accents represent wealth and savings.

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `background` | `#070C07` | `#F0FDF4` | Screen backgrounds |
| `surface` | `#0D160D` | `#FFFFFF` | Cards, elevated elements |
| `primary` | `#10B981` | `#059669` | Buttons, active states |
| `primaryLight` | `#34D399` | `#10B981` | Icons, highlights |
| `primaryDim` | `rgba(16,185,129,.12)` | `rgba(5,150,105,.10)` | Tinted backgrounds |
| `gold` | `#F59E0B` | `#D97706` | Savings, wealth indicators |
| `text` | `#F0FDF4` | `#064E3B` | Primary text |
| `textSecondary` | `#86EFAC` | `#047857` | Labels, captions |
| `error` | `#F87171` | `#EF4444` | Errors, warnings |

### Spacing Scale

```
xs: 4   sm: 8   md: 16   lg: 24   xl: 32   xxl: 48   xxxl: 64
```

### Border Radius

```
sm: 6   md: 10   lg: 14   xl: 20   full: 9999
```

---

## Data Architecture

All data is **offline-first** via AsyncStorage. TanStack Query wraps storage reads as queries and handles cache invalidation on mutation.

### Storage Keys

| Key | Type | Description |
|---|---|---|
| `fortuna:expenses` | `Expense[]` | All logged expenses |
| `fortuna:categories` | `Category[]` | Default + custom categories |
| `fortuna:savings_goals` | `SavingsGoal[]` | Savings goals |
| `fortuna:savings_deposits` | `SavingsDeposit[]` | Money added to goals |
| `fortuna:settings` | `AppSettings` | User settings |

### Data Flow

```
User action
  → useMutation (hook)
    → storageSet (AsyncStorage)
      → queryClient.invalidateQueries
        → useQuery re-fetches
          → UI updates
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your device, or an iOS/Android simulator

### Install

```bash
npm install
```

### Run

```bash
npm start          # start dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
```

### Environment Variables (optional — for Supabase sync)

Create `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Feature Status

See [`docs/CHECKLIST.md`](./docs/CHECKLIST.md) for the full feature checklist with progress tracking.

---

## Commit Convention

```
feat: add expense logging screen
fix: currency formatting for amounts over 1M
chore: install TanStack Query
```

---

## License

MIT
