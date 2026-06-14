# Fortuna — Checklist Part 2: Polish & Core Feature Completion

> Focus: no hardcoded values, PHP only, editable everything, auth flow, splash screen, core UX polish.

Legend: `[ ]` todo · `[x]` done · `[~]` in progress

---

## 1. Remove All Hardcoded Values

- [ ] Currency symbol `₱` is hardcoded in 12+ places — pipe everything through `settings.currencySymbol`
- [ ] `₱` default fallback in every hook/component replaced with `settings?.currencySymbol ?? '₱'` from a single constant
- [ ] No hardcoded color hex values outside of `src/constants/theme.ts`
- [ ] No hardcoded font sizes outside of `src/constants/theme.ts`
- [ ] No hardcoded spacing values outside `Spacing` constant
- [ ] Category fallback color `#6B7280` extracted to a named constant
- [ ] App version string `"v1.0.0"` sourced from `expo-constants` (`Constants.expoConfig.version`)
- [ ] Greeting strings (`Good morning`, etc.) centralised in `src/lib/utils.ts` (already done — verify no duplicates)
- [ ] All `new Date()` calls in UI replaced with a single `todayISO()` util

---

## 2. Currency — PHP Only

- [ ] Remove USD, EUR, SGD, JPY from the currency picker in Settings
- [ ] Remove the currency selector section entirely from Settings (PHP is the only currency)
- [ ] Default `currencySymbol` and `currency` locked to `₱` / `PHP` in `useSettings` defaults
- [ ] Remove `currency` and `currencySymbol` from `AppSettings` type (no longer user-configurable)
- [ ] Update `AppSettings` in Prisma schema — remove `currency` and `currencySymbol` columns
- [ ] Update all hooks and screens that currently spread currency settings

---

## 3. Splash Screen

- [ ] Create `src/app/splash.tsx` — animated Fortuna splash
  - [ ] Fortuna wheel logo fades + scales in on mount
  - [ ] App name "Fortuna" fades in below logo
  - [ ] Latin tagline "Fortuna favet fortibus" fades in last
  - [ ] After 2s animation: check AsyncStorage for onboarding flag → route to onboarding or tabs
  - [ ] Emerald `#070C07` full-screen background
- [ ] Update root `_layout.tsx` to open splash as the initial route
- [ ] Configure `expo-splash-screen` to hide native splash only after JS splash mounts

---

## 4. Auth Flow — Sign In, Register, Forgot Password

### 4a. Sign In Screen (`src/app/auth/sign-in.tsx`) — already exists, needs polish
- [ ] Email field: auto-lowercase, trim on submit
- [ ] Password field: show/hide toggle (👁 button)
- [ ] "Forgot Password?" link below password field → navigates to `auth/forgot-password`
- [ ] Loading spinner replaces button text on submit
- [ ] Error message shown inline (not just toast) for wrong credentials
- [ ] Keyboard `returnKeyType="next"` on email → auto-focus password
- [ ] Disable submit while loading

### 4b. Register Screen (`src/app/auth/sign-up.tsx`) — already exists, needs polish
- [ ] Name field added (first field) → saves to settings on success
- [ ] Email auto-lowercase + trim
- [ ] Password show/hide toggle
- [ ] Confirm password show/hide toggle
- [ ] Real-time password strength indicator (weak / fair / strong)
- [ ] Passwords match validated on blur (not just on submit)
- [ ] "Already have an account? Sign In" link
- [ ] Disable submit while loading

### 4c. Forgot Password Screen (`src/app/auth/forgot-password.tsx`) — new
- [ ] Email input with validation
- [ ] "Send Reset Link" button → calls `supabase.auth.resetPasswordForEmail(email)`
- [ ] Success state: "Check your inbox — reset link sent to [email]"
- [ ] Back to Sign In link
- [ ] Loading + disable on submit
- [ ] Error inline if email not found

---

## 5. Make Everything Editable

### 5a. Expenses — Edit
- [ ] Long-press on expense row → action sheet: "Edit" / "Delete" (currently only Delete)
- [ ] `src/app/edit-expense.tsx` modal — pre-filled with existing values
  - [ ] Editable: amount, description, category, **date** (native DateTimePicker), notes
  - [ ] Save calls `useUpdateExpense`
  - [ ] Validation same as add-expense

### 5b. Expense Date — currently defaults to today and is not editable
- [ ] Add DateTimePicker to `add-expense.tsx` (the date row is display-only right now)
- [ ] User can change the expense date before submitting

### 5c. Savings Goals — Edit
- [ ] Long-press on goal card → action sheet: "Edit Goal" / "Delete Goal"
- [ ] `src/app/edit-goal.tsx` modal — pre-filled
  - [ ] Editable: name, target amount, icon, color, deadline
  - [ ] Save calls `useUpdateSavingsGoal`

### 5d. Categories — Edit
- [ ] Tap on custom category in Settings → open edit modal
- [ ] `src/app/edit-category.tsx` modal — pre-filled
  - [ ] Editable: name, icon, color (default categories: icon + color only, name locked)
  - [ ] Save calls `useUpdateCategory`

### 5e. Savings Deposits — Delete
- [ ] Long-press on deposit history row → confirm delete
- [ ] Calls `useDeleteDeposit` (already implemented) — reverses goal amount
- [ ] Show deposit history per goal (tap goal card to expand deposits list)

### 5f. Profile / Settings — Edit
- [ ] Name field: auto-save on blur (already works — verify)
- [ ] Monthly budget: auto-save on blur (already works — verify)
- [ ] "Clear All Data" confirmation requires typing "DELETE" to confirm (prevent accidental tap)

---

## 6. Core Feature Polish

### 6a. Forms
- [ ] All modals close keyboard on background tap (`TouchableWithoutFeedback` + `Keyboard.dismiss`)
- [ ] Amount inputs: strip leading zeros, format with comma separators as user types
- [ ] All text inputs have `autoCorrect={false}` where appropriate
- [ ] Submit button disabled until required fields are filled (not just on-submit validation)
- [ ] Error messages appear below the specific field, not just as Alert dialogs

### 6b. Loading & Empty States
- [ ] Skeleton shimmer on Dashboard while data loads (replace empty card with skeleton)
- [ ] Skeleton shimmer on Expenses list while loading
- [ ] Skeleton shimmer on Savings list while loading
- [ ] All FABs hidden while data is loading (prevent double-tap creates)

### 6c. Navigation & Transitions
- [ ] Modal present animation is consistent (slide up) across all modals
- [ ] Back navigation from modals dismisses keyboard before animating
- [ ] Bottom tab bar hides when a modal is open (no double navigation confusion)

### 6d. Feedback
- [ ] Success haptic + toast on: add expense, add deposit, add goal, save settings
- [ ] Error haptic + inline error on: validation failure (already partial — complete)
- [ ] Swipe-to-delete shows undo toast with 3s timeout before actually deleting

### 6e. Accessibility
- [ ] All interactive elements have `accessibilityLabel`
- [ ] All images/icons have `accessibilityLabel` or `accessibilityHidden={true}`
- [ ] Minimum tap target 44×44pt on all buttons

---

## 7. Dashboard Polish

- [ ] Fortune Score card collapses/expands on tap (default collapsed to save space)
- [ ] "View all insights" link when there are > 2 insights
- [ ] Pie chart shows "No data" state instead of empty when no expenses
- [ ] Recent transactions shows "This month" label in section header
- [ ] Pull-to-refresh also refreshes Fortune Score and insights

---

## 8. Expenses Screen Polish

- [ ] Month selector (← June 2026 →) to view past months (not just current month)
- [ ] Section headers show subtotal per day (e.g. "Today · ₱1,250")
- [ ] Swipe-to-delete: 3s undo window before permanent delete
- [ ] Empty search results show "No results for '[query]'" with clear button
- [ ] Filter chips scroll horizontally without wrapping (currently wraps)

---

## 9. Savings Screen Polish

- [ ] Goal card shows projected completion date: "At this pace, done by [date]"
- [ ] Deposit history visible per goal (tap to expand / collapse)
- [ ] Completed goals show a trophy animation on first completion
- [ ] Total saved hero shows "₱X of ₱Y across N goals" breakdown

---

## 10. Settings Screen Polish

- [ ] Remove currency selector (PHP only — per requirement)
- [ ] Add "Account" section (show signed-in email or "Not signed in" + Sign In / Sign Out button)
- [ ] "Sign Out" calls `supabase.auth.signOut()` and routes to sign-in
- [ ] Export confirms file saved: "Exported to Files / Share Sheet"
- [ ] About section: app version from `expo-constants`, link to privacy policy placeholder

---

## Progress Tracker

| Area | Status |
|---|---|
| Hardcoded values removed | ⬜ Not Started |
| PHP-only currency | ⬜ Not Started |
| Splash screen | ⬜ Not Started |
| Auth flow (sign in / register / forgot pw) | ⬜ Not Started |
| Edit expense (incl. date) | ⬜ Not Started |
| Edit savings goal | ⬜ Not Started |
| Edit category | ⬜ Not Started |
| Delete deposit | ⬜ Not Started |
| Form polish (validation, keyboard) | ⬜ Not Started |
| Loading / skeleton states | ⬜ Not Started |
| Dashboard polish | ⬜ Not Started |
| Expenses screen polish | ⬜ Not Started |
| Savings screen polish | ⬜ Not Started |
| Settings polish | ⬜ Not Started |
