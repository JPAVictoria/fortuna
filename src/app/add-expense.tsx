import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { Input } from '@/components/ui/Input';
import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAddExpense, useCategories } from '@/hooks/useExpenses';
import { useHaptics } from '@/hooks/useHaptics';
import { DEFAULT_CURRENCY_SYMBOL } from '@/hooks/useSettings';
import { useToast } from '@/providers/ToastProvider';
import { formatAmountInput, todayISO } from '@/lib/utils';

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
  const [date, setDate] = useState(new Date(todayISO()));
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  async function pickPhoto(useCamera: boolean) {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed', 'Please allow access in Settings.'); return; }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 3] })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 3] });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  function handleAddPhoto() {
    Alert.alert('Add Receipt', undefined, [
      { text: 'Camera', onPress: () => pickPhoto(true) },
      { text: 'Photo Library', onPress: () => pickPhoto(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

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
      { amount: parsed, description: description.trim(), categoryId: selectedCategoryId, date: date.toISOString(), notes: notes.trim() || undefined, photoUri },
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.handleWrap}><View style={[styles.handle, { backgroundColor: theme.border }]} /></View>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>Log Expense</Text>
          <TouchableOpacity onPress={() => router.back()} hitSlop={16} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Input label="Amount" prefix={DEFAULT_CURRENCY_SYMBOL} placeholder="0.00" value={amount} onChangeText={v => setAmount(formatAmountInput(v))} keyboardType="decimal-pad" returnKeyType="next" autoFocus autoCorrect={false} />
          <Input label="Description" placeholder="What did you spend on?" value={description} onChangeText={setDescription} returnKeyType="next" autoCorrect={false} />

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

          <DatePickerField
            value={date}
            onChange={setDate}
            maximumDate={new Date(todayISO())}
          />

          <Input label="Notes (optional)" placeholder="Add a note..." value={notes} onChangeText={setNotes} multiline style={{ minHeight: 64, textAlignVertical: 'top' }} />

          {/* Receipt photo */}
          <View style={styles.photoSection}>
            {photoUri ? (
              <View style={styles.photoPreviewWrap}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity onPress={() => setPhotoUri(undefined)} style={styles.photoRemove} accessibilityLabel="Remove photo">
                  <Ionicons name="close-circle" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handleAddPhoto} style={[styles.photoBtn, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]} accessibilityLabel="Add receipt photo">
                <Ionicons name="camera-outline" size={18} color={theme.textMuted} />
                <Text style={[styles.photoBtnLabel, { color: theme.textMuted }]}>Add Receipt Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button label="Log Expense" onPress={handleSubmit} loading={isPending} fullWidth size="lg" style={styles.submit} />
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
  chips: { gap: Spacing.sm, paddingBottom: Spacing.xs },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: FontSize.sm, fontWeight: '500' },
  photoSection: { gap: Spacing.xs },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderStyle: 'dashed' },
  photoBtnLabel: { fontSize: FontSize.sm },
  photoPreviewWrap: { position: 'relative' },
  photoPreview: { width: '100%', height: 140, borderRadius: BorderRadius.md },
  photoRemove: { position: 'absolute', top: 6, right: 6 },
  submit: { marginTop: Spacing.sm },
});
