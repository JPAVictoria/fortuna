import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { BorderRadius, FontSize } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  onPress: () => void;
  label?: string;
  accessibilityLabel?: string;
};

export function FAB({ onPress, label = '+', accessibilityLabel = 'Add new' }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
  },
});
