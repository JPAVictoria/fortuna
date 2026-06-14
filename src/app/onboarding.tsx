import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useUpdateSettings } from '@/hooks/useSettings';
import { useAddSavingsGoal } from '@/hooks/useSavings';

const CURRENCIES = [
  { label: '₱ PHP', currency: 'PHP', symbol: '₱' },
  { label: '$ USD', currency: 'USD', symbol: '$' },
  { label: '€ EUR', currency: 'EUR', symbol: '€' },
  { label: 'S$ SGD', currency: 'SGD', symbol: 'S$' },
];

const STEPS = ['welcome', 'profile', 'goal'] as const;
type Step = typeof STEPS[number];

export default function OnboardingScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const { mutate: updateSettings } = useUpdateSettings();
  const { mutate: addGoal } = useAddSavingsGoal();

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState({ label: '₱ PHP', currency: 'PHP', symbol: '₱' });
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  function next() {
    haptics.medium();
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function finish() {
    haptics.success();
    updateSettings({ userName: name.trim() || 'You', currency: currency.currency, currencySymbol: currency.symbol });

    if (goalName.trim() && parseFloat(goalAmount) > 0) {
      addGoal({ name: goalName.trim(), targetAmount: parseFloat(goalAmount), icon: '🏆', color: '#F59E0B' });
    }

    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>

        {/* Step dots */}
        <View style={styles.dots}>
          {STEPS.map((s) => (
            <View
              key={s}
              style={[
                styles.dot,
                { backgroundColor: s === step ? theme.primary : theme.border },
                s === step && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {step === 'welcome' && (
          <View style={styles.page}>
            <FortunaLogo size={100} />
            <Text style={[styles.title, { color: theme.text }]}>Welcome to Fortuna</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>
              Track expenses, build savings goals, and command your finances like a Roman emperor.
            </Text>
            <Text style={[styles.latin, { color: theme.textMuted }]}>
              "Fortuna favet fortibus." — Fortune favors the bold.
            </Text>
            <Button label="Begin My Fortune →" onPress={next} fullWidth size="lg" style={styles.btn} />
          </View>
        )}

        {step === 'profile' && (
          <View style={styles.page}>
            <Text style={[styles.stepTitle, { color: theme.textSecondary }]}>STEP 1 OF 2</Text>
            <Text style={[styles.title, { color: theme.text }]}>What's your name?</Text>
            <Input
              label="Your Name"
              placeholder="e.g. Marcus, Andrea..."
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
            />
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>CURRENCY</Text>
            <View style={styles.currencyGrid}>
              {CURRENCIES.map(c => (
                <TouchableOpacity
                  key={c.currency}
                  onPress={() => { haptics.light(); setCurrency(c); }}
                  style={[
                    styles.currencyChip,
                    {
                      backgroundColor: currency.currency === c.currency ? theme.primaryDim : theme.surface,
                      borderColor: currency.currency === c.currency ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text style={[styles.currencyLabel, { color: currency.currency === c.currency ? theme.primary : theme.textMuted }]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button label="Continue →" onPress={next} fullWidth size="lg" style={styles.btn} />
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.page}>
            <Text style={[styles.stepTitle, { color: theme.textSecondary }]}>STEP 2 OF 2</Text>
            <Text style={[styles.title, { color: theme.text }]}>Set your first savings goal</Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>
              Even small goals build the habit of saving. You can skip this and add later.
            </Text>
            <Input label="Goal Name" placeholder="e.g. Emergency Fund, New Phone..." value={goalName} onChangeText={setGoalName} />
            <Input
              label={`Target Amount (${currency.symbol})`}
              prefix={currency.symbol}
              placeholder="0.00"
              value={goalAmount}
              onChangeText={setGoalAmount}
              keyboardType="decimal-pad"
            />
            <Button label="Start My Journey 🏛️" onPress={finish} fullWidth size="lg" style={styles.btn} />
            <TouchableOpacity onPress={finish} style={styles.skip}>
              <Text style={[styles.skipLabel, { color: theme.textMuted }]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  dots: { flexDirection: 'row', gap: 8, alignSelf: 'center', paddingTop: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24 },
  page: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  stepTitle: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', lineHeight: 34 },
  sub: { fontSize: FontSize.md, lineHeight: 24 },
  latin: { fontSize: FontSize.sm, fontStyle: 'italic' },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8, marginTop: Spacing.xs },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  currencyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  currencyLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  btn: { marginTop: Spacing.sm },
  skip: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipLabel: { fontSize: FontSize.sm },
});
