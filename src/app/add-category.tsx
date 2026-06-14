import { Ionicons } from '@expo/vector-icons';
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
import { CATEGORY_ICONS } from '@/constants/icons';
import { useTheme } from '@/hooks/use-theme';
import { useAddCategory } from '@/hooks/useExpenses';

export default function AddCategoryModal() {
  const theme = useTheme();
  const { mutate: addCategory, isPending } = useAddCategory();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);
  const [customIcon, setCustomIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLOR_SWATCHES[0]);

  const resolvedIcon = customIcon.trim() || icon;

  function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }

    addCategory(
      { name: name.trim(), icon: resolvedIcon, color: selectedColor },
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
          <Text style={[styles.title, { color: theme.text }]}>New Category</Text>
          <TouchableOpacity onPress={() => router.back()} hitSlop={16} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          {/* Preview */}
          <View
            style={[
              styles.preview,
              { backgroundColor: selectedColor + '22', borderColor: selectedColor + '55' },
            ]}>
            <Text style={styles.previewIcon}>{resolvedIcon}</Text>
            <Text style={[styles.previewName, { color: selectedColor }]}>
              {name || 'Category Name'}
            </Text>
          </View>

          <Input
            label="Category Name"
            placeholder="e.g. Gym, Hobbies, Kids..."
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          {/* Icon picker */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>ICON</Text>
            <View style={styles.iconGrid}>
              {CATEGORY_ICONS.map((i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setIcon(i); setCustomIcon(''); }}
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor:
                        icon === i && !customIcon ? selectedColor + '33' : theme.backgroundElement,
                      borderColor: icon === i && !customIcon ? selectedColor : theme.border,
                      borderWidth: icon === i && !customIcon ? 2 : 1,
                    },
                  ]}>
                  <Text style={styles.iconText}>{i}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              placeholder="Or type any emoji..."
              value={customIcon}
              onChangeText={setCustomIcon}
              maxLength={4}
              style={{ fontSize: 22, textAlign: 'center' }}
            />
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

          <Button
            label="Create Category"
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
  preview: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  previewIcon: { fontSize: 28 },
  previewName: { fontSize: FontSize.lg, fontWeight: '700' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: { borderWidth: 2.5, borderColor: '#FFFFFF' },
  swatchCheck: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  submit: { marginTop: Spacing.sm },
});
