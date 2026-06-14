import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { Category } from '@/types';

type Props = {
  category: Category;
  size?: 'sm' | 'md';
};

export function CategoryBadge({ category, size = 'md' }: Props) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: category.color + '22' },
        size === 'sm' && styles.sm,
      ]}>
      <Text style={size === 'sm' ? styles.iconSm : styles.icon}>{category.icon}</Text>
      {size === 'md' && (
        <Text style={[styles.name, { color: category.color }]}>{category.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  icon: { fontSize: 14 },
  iconSm: { fontSize: 12 },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
