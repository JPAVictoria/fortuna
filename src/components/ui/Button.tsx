import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: Props) {
  const theme = useTheme();

  const containerStyle = [
    styles.base,
    size === 'sm' && styles.sm,
    size === 'md' && styles.md,
    size === 'lg' && styles.lg,
    variant === 'primary' && { backgroundColor: theme.primary },
    variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    variant === 'danger' && { backgroundColor: theme.error },
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'secondary'
        ? theme.primary
        : theme.primary;

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || loading}
      activeOpacity={0.75}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: labelColor }, size === 'sm' && styles.labelSm]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
  },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 6 },
  md: { paddingHorizontal: Spacing.md, paddingVertical: 13 },
  lg: { paddingHorizontal: Spacing.lg, paddingVertical: 16 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelSm: { fontSize: FontSize.sm },
});
