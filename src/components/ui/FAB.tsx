import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function FAB({ onPress, accessibilityLabel = 'Add new' }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.primary }]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      <Ionicons name="add" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
