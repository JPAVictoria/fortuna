import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useCategories } from '@/hooks/useExpenses';
import { useAddRecurring } from '@/hooks/useRecurring';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { formatAmountInput, todayISO } from '@/lib/utils';
import { RecurringExpense } from '@/types';

const FREQUENCIES: { label: string; value: RecurringExpense['frequency'] }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function AddRecurringModal() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();
  const { data: categories = [] } = useCategories();
  const { mutate: addRecurring, isPending } = useAddRecurring();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [frequency, setFrequency] = useState<RecurringExpense['frequency']>('monthly');
  const [notes, setNotes] = useState('');

  const parsedAmount = parseFloat(amount.replace(/,/g, ''));
  const canSubmit = !isNaN(parsedAmount) && parsedAmount > 0 && description.trim().length > 0 && selectedCategoryId.length > 0;

  function handleSubmit() {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) { haptics.error(); Alert.alert('Invalid Amount', 'Enter a valid amount.'); return; }
    if (!description.trim()) { haptics.error(); Alert.alert('Missing Description', 'Describe this recurring expense.'); return; }
    if (!selectedCategoryId) { haptics.error(); Alert.alert('No Category', 'Please select a category.'); return; }

    addRecurring(
      { amount: parsed, description: description.trim(), categoryId: selectedCategoryId, frequency, nextDue: todayISO(), notes: notes.trim() || undefined, active: true },
      {
        onSuccess: () => { haptics.success(); toast('Recurring expense added!'); router.back(); },
        onError: () => { haptics.error(); toast('Failed to save', 'error'); },
      }
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
          <View style={styles.handleWrap}><View style={[styles.handle, { backgroundColor: theme.border }]} /></View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>Recurring Expense</Text>
            <TouchableOpacity onPress={() => { Keyboard.dismiss(); router.back(); }} hitSlop={16} accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
            <Input label="Amount" prefix={DEFAULT_CURRENCY_SYMBOL} placeholder="0.00" value={amount} onChangeText={v => setAmount(formatAmountInput(v))} keyboardType="decimal-pad" returnKeyType="next" autoFocus />
            <Input label="Description" placeholder="e.g. Netflix, Gym membership..." value={description} onChangeText={setDescription} returnKeyType="next" autoCorrect={false} />

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>FREQUENCY</Text>
              <View style={styles.freqRow}>
                {FREQUENCIES.map(f => (
                  <TouchableOpacity
                    key={f.value}
                    onPress={() => setFrequency(f.value)}
                    style={[styles.freqBtn, { backgroundColor: frequency === f.value ? theme.primaryDim : theme.backgroundElement, borderColor: frequency === f.value ? theme.primary : theme.border, borderWidth: frequency === f.value ? 1.5 : 1 }]}>
                    <Text style={[styles.freqLabel, { color: frequency === f.value ? theme.primary : theme.textMuted }]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {categories.map(cat => {
                  const active = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => { haptics.light(); setSelectedCategoryId(cat.id); }}
                      style={[styles.chip, { backgroundColor: active ? cat.color + '33' : theme.backgroundElement, borderColor: active ? cat.color : theme.border, borderWidth: active ? 1.5 : 1 }]}>
                      <Text style={styles.chipIcon}>{cat.icon}</Text>
                      <Text style={[styles.chipLabel, { color: active ? cat.color : theme.textMuted }]}>{cat.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <Input label="Notes (optional)" placeholder="Add a note..." value={notes} onChangeText={setNotes} returnKeyType="done" />
            <Button label="Add Recurring" onPress={handleSubmit} loading={isPending} disabled={!canSubmit} fullWidth size="lg" style={styles.submit} />
          </ScrollView>
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
  form: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  field: { gap: 8 },
  label: { fontSize: FontSize.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  freqRow: { flexDirection: 'row', gap: Spacing.sm },
  freqBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  freqLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  chips: { gap: Spacing.sm, paddingBottom: Spacing.xs },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: FontSize.sm, fontWeight: '500' },
  submit: { marginTop: Spacing.sm },
});
