import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  icon: string;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  icon: { fontSize: 48 },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
});
