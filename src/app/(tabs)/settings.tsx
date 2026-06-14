import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useQueryClient } from '@tanstack/react-query';

import { CategoryItem } from '@/components/settings/CategoryItem';
import { Card } from '@/components/ui/Card';
import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCategories } from '@/hooks/useExpenses';
import { useExpenses } from '@/hooks/useExpenses';
import { useSavingsGoals } from '@/hooks/useSavings';
import { DEFAULT_CURRENCY_SYMBOL, useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/providers/ToastProvider';
import { storageClear } from '@/lib/storage';
import { formatDate } from '@/lib/utils';


export default function SettingsScreen() {
  const theme = useTheme();
  const { data: settings } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const { data: categories = [] } = useCategories();
  const { data: expenses = [] } = useExpenses();
  const { data: goals = [] } = useSavingsGoals();
  const qc = useQueryClient();
  const haptics = useHaptics();
  const toast = useToast();

  async function handleExportCSV() {
    try {
      const header = 'Date,Description,Category,Amount\n';
      const rows = expenses.map(e => {
        const cat = categories.find(c => c.id === e.categoryId);
        return `${formatDate(e.date)},"${e.description}","${cat?.name ?? 'Other'}",${e.amount}`;
      }).join('\n');

      const csv = header + rows;
      const path = `${FileSystem.cacheDirectory}fortuna-expenses.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Fortuna Data' });
      } else {
        toast('Export not available on this device', 'error');
      }
    } catch {
      toast('Export failed', 'error');
    }
  }

  function handleClearData() {
    haptics.warning();
    Alert.alert('Clear All Data', 'Permanently delete all expenses, goals, and categories?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear Everything',
        style: 'destructive',
        onPress: async () => {
          await storageClear();
          qc.clear();
          haptics.success();
          toast('All data cleared');
        },
      },
    ]);
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
                onChangeText={v => updateSettings({ userName: v })}
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
                onChangeText={v => updateSettings({ monthlyBudget: parseFloat(v) || undefined })}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
          </Card>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>CATEGORIES</Text>
          <Card padded={false}>
            {categories.map(cat => <CategoryItem key={cat.id} category={cat} />)}
          </Card>
          <TouchableOpacity
            style={[styles.addCatBtn, { borderColor: theme.primary, backgroundColor: theme.primaryDim }]}
            onPress={() => { haptics.light(); router.push('/add-category'); }}>
            <Text style={[styles.addCatLabel, { color: theme.primary }]}>+ Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DATA</Text>
          <Card padded={false}>
            <TouchableOpacity style={[styles.dataRow, { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]} onPress={handleExportCSV}>
              <Text style={styles.dataIcon}>📤</Text>
              <View style={styles.dataInfo}>
                <Text style={[styles.dataLabel, { color: theme.text }]}>Export Expenses as CSV</Text>
                <Text style={[styles.dataDesc, { color: theme.textMuted }]}>{expenses.length} expenses ready to export</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dataRow} onPress={handleClearData}>
              <Text style={styles.dataIcon}>🗑️</Text>
              <View style={styles.dataInfo}>
                <Text style={[styles.dataLabel, { color: theme.error }]}>Clear All Data</Text>
                <Text style={[styles.dataDesc, { color: theme.textMuted }]}>Permanently delete everything</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <Text style={[styles.version, { color: theme.textMuted }]}>Fortuna v{Constants.expoConfig?.version ?? '1.0.0'}</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '700' },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 14 },
  rowLabel: { fontSize: FontSize.md, fontWeight: '500', flex: 1 },
  input: { fontSize: FontSize.md, textAlign: 'right', flex: 1 },
  addCatBtn: { paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1.5, alignItems: 'center', borderStyle: 'dashed' },
  addCatLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  dataRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.sm },
  dataIcon: { fontSize: 20 },
  dataInfo: { flex: 1, gap: 2 },
  dataLabel: { fontSize: FontSize.md, fontWeight: '600' },
  dataDesc: { fontSize: FontSize.sm },
  version: { fontSize: FontSize.xs, textAlign: 'center', paddingVertical: Spacing.lg },
});
