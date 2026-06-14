import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAddExpense, useCategories } from '@/hooks/useExpenses';
import { useHaptics } from '@/hooks/useHaptics';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { todayISO } from '@/lib/utils';

export default function AddExpenseModal() {
  const theme = useTheme();
  const { data: categories = [] } = useCategories();
  const { mutate: addExpense, isPending } = useAddExpense();
  const haptics = useHaptics();
  const toast = useToast();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  function handleSubmit() {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) {
      haptics.error();
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      haptics.error();
      Alert.alert('Missing Description', 'Please describe what you spent on.');
      return;
    }
    if (!selectedCategoryId) {
      haptics.error();
      Alert.alert('No Category', 'Please select a category.');
      return;
    }

    addExpense(
      { amount: parsed, description: description.trim(), categoryId: selectedCategoryId, date: todayISO(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          haptics.success();
          toast('Expense logged!');
          router.back();
        },
        onError: () => {
          haptics.error();
          toast('Failed to save expense', 'error');
        },
      }
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.handleWrap}><View style={[styles.handle, { backgroundColor: theme.border }]} /></View>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>Log Expense</Text>
          <TouchableOpacity onPress={() => router.back()} hitSlop={16}>
            <Text style={[styles.close, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Input label="Amount" prefix={DEFAULT_CURRENCY_SYMBOL} placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" returnKeyType="next" autoFocus />
          <Input label="Description" placeholder="What did you spend on?" value={description} onChangeText={setDescription} returnKeyType="next" />

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

          <View style={[styles.dateRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text>📅</Text>
            <Text style={[styles.dateLabel, { color: theme.textMuted }]}>Date</Text>
            <Text style={[styles.dateValue, { color: theme.text }]}>
              {new Date(todayISO()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
          </View>

          <Input label="Notes (optional)" placeholder="Add a note..." value={notes} onChangeText={setNotes} multiline style={{ minHeight: 64, textAlignVertical: 'top' }} />
          <Button label="Log Expense" onPress={handleSubmit} loading={isPending} fullWidth size="lg" style={styles.submit} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  close: { fontSize: FontSize.lg },
  form: { paddingHorizontal: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  field: { gap: 8 },
  label: { fontSize: FontSize.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  chips: { gap: Spacing.sm, paddingBottom: Spacing.xs },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: FontSize.sm, fontWeight: '500' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5 },
  dateLabel: { flex: 1, fontSize: FontSize.sm },
  dateValue: { fontSize: FontSize.md, fontWeight: '500' },
  submit: { marginTop: Spacing.sm },
});
