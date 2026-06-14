import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getDailyQuote } from '@/constants/quotes';

export function FortunaQuote() {
  const theme = useTheme();
  const quote = getDailyQuote();

  return (
    <View style={[styles.card, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '33' }]}>
      <Text style={[styles.latin, { color: theme.primaryLight }]}>"{quote.text}"</Text>
      <Text style={[styles.translation, { color: theme.textSecondary }]}>{quote.translation}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>FORTUNA · DAILY WISDOM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 6,
  },
  latin: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  translation: {
    fontSize: FontSize.md,
    fontWeight: '500',
    lineHeight: 22,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
