import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  prefix?: string;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, prefix, style, ...rest },
  ref
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.error : focused ? theme.primary : theme.border,
          },
        ]}>
        {prefix ? (
          <Text style={[styles.prefix, { color: theme.textMuted }]}>{prefix}</Text>
        ) : null}
        <TextInput
          ref={ref}
          style={[styles.input, { color: theme.text }, style]}
          placeholderTextColor={theme.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); rest.onBlur?.(e); }}
          {...rest}
        />
      </View>
      {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  prefix: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: 14,
  },
  error: {
    fontSize: FontSize.sm,
  },
});
