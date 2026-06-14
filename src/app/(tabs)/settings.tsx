import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryItem } from '@/components/settings/CategoryItem';
import { Card } from '@/components/ui/Card';
import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories } from '@/hooks/useExpenses';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { storageClear } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';

const CURRENCIES = [
  { label: 'PHP ₱', currency: 'PHP', symbol: '₱' },
  { label: 'USD $', currency: 'USD', symbol: '$' },
  { label: 'EUR €', currency: 'EUR', symbol: '€' },
  { label: 'SGD S$', currency: 'SGD', symbol: 'S$' },
  { label: 'JPY ¥', currency: 'JPY', symbol: '¥' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { data: settings } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const { data: categories = [] } = useCategories();
  const qc = useQueryClient();

  function handleClearData() {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your expenses, savings goals, and categories. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await storageClear();
            qc.clear();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <FortunaLogo size={36} />
          <Text style={[styles.pageTitle, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Profile */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>PROFILE</Text>
          <Card padded={false}>
            <View style={[styles.row, { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Your Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={settings?.userName ?? ''}
                onChangeText={(v) => updateSettings({ userName: v })}
                placeholder="Your name"
                placeholderTextColor={theme.textMuted}
                returnKeyType="done"
              />
            </View>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Monthly Budget</Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={settings?.monthlyBudget ? String(settings.monthlyBudget) : ''}
                onChangeText={(v) => {
                  const num = parseFloat(v);
                  updateSettings({ monthlyBudget: isNaN(num) ? undefined : num });
                }}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
          </Card>
        </View>

        {/* Currency */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>CURRENCY</Text>
          <View style={styles.currencyRow}>
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c.currency}
                style={[
                  styles.currencyChip,
                  {
                    backgroundColor:
                      settings?.currency === c.currency ? theme.primaryDim : theme.surface,
                    borderColor:
                      settings?.currency === c.currency ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => updateSettings({ currency: c.currency, currencySymbol: c.symbol })}>
                <Text
                  style={[
                    styles.currencyLabel,
                    {
                      color: settings?.currency === c.currency ? theme.primary : theme.textMuted,
                    },
                  ]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>CATEGORIES</Text>
          <Card padded={false}>
            {categories.map((cat) => (
              <CategoryItem key={cat.id} category={cat} />
            ))}
          </Card>
          <TouchableOpacity
            style={[styles.addCatBtn, { borderColor: theme.primary, backgroundColor: theme.primaryDim }]}
            onPress={() => router.push('/add-category')}>
            <Text style={[styles.addCatLabel, { color: theme.primary }]}>+ Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DATA</Text>
          <Card padded={false}>
            <TouchableOpacity
              style={[styles.dangerRow, { borderBottomColor: theme.border }]}
              onPress={handleClearData}>
              <Text style={[styles.dangerLabel, { color: theme.error }]}>Clear All Data</Text>
              <Text style={[styles.dangerDesc, { color: theme.textMuted }]}>
                Permanently delete everything
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        <Text style={[styles.version, { color: theme.textMuted }]}>Fortuna v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '700' },
  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: FontSize.md, fontWeight: '500', flex: 1 },
  input: {
    fontSize: FontSize.md,
    textAlign: 'right',
    flex: 1,
  },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  currencyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  currencyLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  addCatBtn: {
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  addCatLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  dangerRow: {
    padding: Spacing.md,
    gap: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dangerLabel: { fontSize: FontSize.md, fontWeight: '600' },
  dangerDesc: { fontSize: FontSize.sm },
  version: { fontSize: FontSize.xs, textAlign: 'center', paddingVertical: Spacing.lg },
});
