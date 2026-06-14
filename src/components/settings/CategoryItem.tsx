import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDeleteCategory } from '@/hooks/useExpenses';
import { Category } from '@/types';

type Props = { category: Category };

export function CategoryItem({ category }: Props) {
  const theme = useTheme();
  const { mutate: deleteCategory } = useDeleteCategory();

  function handleTap() {
    router.push({
      pathname: '/edit-category',
      params: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        isDefault: String(category.isDefault),
        monthlyBudget: category.monthlyBudget ? String(category.monthlyBudget) : '',
      },
    });
  }

  function handleDelete() {
    if (category.isDefault) {
      Alert.alert('Cannot Delete', 'Default categories cannot be deleted.');
      return;
    }
    Alert.alert('Delete Category', `Remove "${category.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category.id) },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={handleTap}
      activeOpacity={0.7}
      style={[styles.row, { borderBottomColor: theme.border }]}
      accessibilityLabel={`Edit ${category.name} category`}>
      <View style={[styles.iconWrap, { backgroundColor: category.color + '22' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={[styles.name, { color: theme.text }]}>{category.name}</Text>
      {!category.isDefault && (
        <TouchableOpacity onPress={handleDelete} hitSlop={12} accessibilityLabel={`Delete ${category.name}`}>
          <Text style={[styles.delete, { color: theme.error }]}>Remove</Text>
        </TouchableOpacity>
      )}
      {category.isDefault && (
        <Text style={[styles.default, { color: theme.textMuted }]}>Default</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 13,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 16 },
  name: { flex: 1, fontSize: FontSize.md, fontWeight: '500' },
  delete: { fontSize: FontSize.sm, fontWeight: '600' },
  default: { fontSize: FontSize.sm },
});
