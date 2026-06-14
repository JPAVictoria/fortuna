import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { CATEGORY_COLOR_SWATCHES } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useAddSavingsGoal } from '@/hooks/useSavings';
import { useSettings } from '@/hooks/useSettings';

const GOAL_ICONS = ['🏠', '✈️', '🚗', '💻', '📱', '🎓', '💍', '🏋️', '🌏', '🛡️', '🎸', '🍀'];

export default function AddGoalModal() {
  const theme = useTheme();
  const { mutate: addGoal, isPending } = useAddSavingsGoal();
  const { data: settings } = useSettings();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏠');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLOR_SWATCHES[7]);

  const symbol = settings?.currencySymbol ?? '₱';

  function handleSubmit() {
    const parsed = parseFloat(targetAmount.replace(/,/g, ''));
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please name your savings goal.');
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount.');
      return;
    }

    addGoal(
      {
        name: name.trim(),
        targetAmount: parsed,
        icon: selectedIcon,
        color: selectedColor,
      },
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
          <Text style={[styles.title, { color: theme.text }]}>New Savings Goal</Text>
          <TouchableOpacity onPress={() => router.back()} hitSlop={16}>
            <Text style={[styles.close, { color: theme.textMuted }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Input
            label="Goal Name"
            placeholder="e.g. Emergency Fund, New Laptop..."
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <Input
            label="Target Amount"
            prefix={symbol}
            placeholder="0.00"
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />

          {/* Icon picker */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>ICON</Text>
            <View style={styles.iconGrid}>
              {GOAL_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor:
                        selectedIcon === icon ? selectedColor + '33' : theme.backgroundElement,
                      borderColor: selectedIcon === icon ? selectedColor : theme.border,
                      borderWidth: selectedIcon === icon ? 2 : 1,
                    },
                  ]}>
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color picker */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>COLOR</Text>
            <View style={styles.colorRow}>
              {CATEGORY_COLOR_SWATCHES.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.swatch,
                    { backgroundColor: color },
                    selectedColor === color && styles.swatchActive,
                  ]}>
                  {selectedColor === color && (
                    <Text style={styles.swatchCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View
            style={[
              styles.preview,
              { backgroundColor: selectedColor + '22', borderColor: selectedColor + '55' },
            ]}>
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text style={[styles.previewName, { color: selectedColor }]}>
              {name || 'Your Goal'}
            </Text>
            <Text style={[styles.previewAmount, { color: theme.textMuted }]}>
              Target: {symbol}{targetAmount || '0.00'}
            </Text>
          </View>

          <Button
            label="Create Goal"
            onPress={handleSubmit}
            loading={isPending}
            fullWidth
            size="lg"
            style={styles.submit}
          />
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: '700' },
  close: { fontSize: FontSize.lg },
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  field: { gap: 8 },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 24 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  swatchCheck: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  preview: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  previewIcon: { fontSize: 36 },
  previewName: { fontSize: FontSize.lg, fontWeight: '700' },
  previewAmount: { fontSize: FontSize.sm },
  submit: { marginTop: Spacing.sm },
});
