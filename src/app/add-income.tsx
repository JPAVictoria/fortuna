import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useAddIncome } from '@/hooks/useIncome';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { formatAmountInput, todayISO } from '@/lib/utils';

const INCOME_SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus', 'Other'];

export default function AddIncomeModal() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();
  const { mutate: addIncome, isPending } = useAddIncome();

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');

  const parsedAmount = parseFloat(amount.replace(/,/g, ''));
  const canSubmit = !isNaN(parsedAmount) && parsedAmount > 0 && source.trim().length > 0;

  function handleSubmit() {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) { haptics.error(); Alert.alert('Invalid Amount', 'Please enter a valid amount.'); return; }
    if (!source.trim()) { haptics.error(); Alert.alert('Missing Source', 'Please enter an income source.'); return; }

    addIncome(
      { amount: parsed, source: source.trim(), date: todayISO(), notes: notes.trim() || undefined },
      {
        onSuccess: () => { haptics.success(); toast('Income recorded! 💰'); router.back(); },
        onError: () => { haptics.error(); toast('Failed to save income', 'error'); },
      }
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
          <View style={styles.handleWrap}><View style={[styles.handle, { backgroundColor: theme.border }]} /></View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>Record Income</Text>
            <TouchableOpacity onPress={() => { Keyboard.dismiss(); router.back(); }} hitSlop={16} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input label="Amount" prefix={DEFAULT_CURRENCY_SYMBOL} placeholder="0.00" value={amount} onChangeText={v => setAmount(formatAmountInput(v))} keyboardType="decimal-pad" returnKeyType="next" autoFocus />

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>SOURCE</Text>
              <View style={styles.sourceGrid}>
                {INCOME_SOURCES.map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSource(s)}
                    accessibilityLabel={`Select source ${s}`}
                    style={[styles.sourceChip, { backgroundColor: source === s ? theme.primaryDim : theme.backgroundElement, borderColor: source === s ? theme.primary : theme.border, borderWidth: source === s ? 1.5 : 1 }]}>
                    <Text style={[styles.sourceLabel, { color: source === s ? theme.primary : theme.textMuted }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Input placeholder="Or type a custom source..." value={source === INCOME_SOURCES.find(s2 => s2 === source) ? '' : source} onChangeText={setSource} returnKeyType="next" autoCorrect={false} />
            </View>

            <Input label="Notes (optional)" placeholder="Add a note..." value={notes} onChangeText={setNotes} returnKeyType="done" />
            <Button label="Record Income" onPress={handleSubmit} loading={isPending} disabled={!canSubmit} fullWidth size="lg" style={styles.submit} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  handleWrap: { alignItems: 'center', paddingTop: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '700' },
  form: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingTop: Spacing.xs },
  field: { gap: 8 },
  label: { fontSize: FontSize.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sourceChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sourceLabel: { fontSize: FontSize.sm, fontWeight: '500' },
  submit: { marginTop: Spacing.sm },
});
