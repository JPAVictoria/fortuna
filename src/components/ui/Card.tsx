import { StyleSheet, View, ViewProps } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = ViewProps & {
  padded?: boolean;
  gold?: boolean;
};

export function Card({ style, padded = true, gold = false, ...rest }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: gold ? theme.gold + '33' : theme.border,
        },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.md,
  },
});
