import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAddDeposit } from '@/hooks/useSavings';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';

export default function AddDepositModal() {
  const theme = useTheme();
  const { goalId, goalName } = useLocalSearchParams<{ goalId: string; goalName: string }>();
  const { mutate: addDeposit, isPending } = useAddDeposit();

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit() {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!goalId) {
      Alert.alert('Error', 'No goal selected.');
      return;
    }

    addDeposit(
      { goalId, amount: parsed, notes: notes.trim() || undefined },
      { onSuccess: () => router.back() }
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Add Deposit</Text>
            {goalName ? (
              <Text style={[styles.goalName, { color: theme.gold }]}>🪙 {goalName}</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => router.back()} hitSlop={16}>
            <Text style={[styles.close, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Amount"
            prefix={DEFAULT_CURRENCY_SYMBOL}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            returnKeyType="next"
            autoFocus
          />

          <Input
            label="Notes (optional)"
            placeholder="e.g. Monthly savings, birthday gift..."
            value={notes}
            onChangeText={setNotes}
            returnKeyType="done"
          />

          <Button
            label="Add to Savings"
            onPress={handleSubmit}
            loading={isPending}
            fullWidth
            size="lg"
            style={styles.submit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  handleWrap: { alignItems: 'center', paddingTop: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: '700' },
  goalName: { fontSize: FontSize.sm, fontWeight: '600', marginTop: 2 },
  close: { fontSize: FontSize.lg },
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  submit: { marginTop: Spacing.sm },
});
