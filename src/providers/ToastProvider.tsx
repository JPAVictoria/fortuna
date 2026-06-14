import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ToastType = 'success' | 'error' | 'info';
type ToastOptions = { type?: ToastType; onUndo?: () => void; undoLabel?: string };
type ToastFn = (message: string, typeOrOptions?: ToastType | ToastOptions) => void;

const ToastContext = createContext<ToastFn>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

type ToastItem = { message: string; type: ToastType; onUndo?: () => void; undoLabel?: string };

export function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastItem | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const anim = useRef<Animated.CompositeAnimation | null>(null);

  const show: ToastFn = useCallback((message, typeOrOptions = 'success') => {
    const opts: ToastOptions = typeof typeOrOptions === 'string'
      ? { type: typeOrOptions }
      : typeOrOptions;

    anim.current?.stop();
    setToast({ message, type: opts.type ?? 'success', onUndo: opts.onUndo, undoLabel: opts.undoLabel });

    anim.current = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(opts.onUndo ? 3000 : 2200),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);
    anim.current.start(() => setToast(null));
  }, [opacity]);

  function handleUndo() {
    anim.current?.stop();
    toast?.onUndo?.();
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast(null));
  }

  const bgColor =
    toast?.type === 'success'
      ? theme.primary
      : toast?.type === 'error'
        ? theme.error
        : theme.surface;

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: bgColor, bottom: insets.bottom + 90, opacity },
          ]}>
          <Text style={styles.icon}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </Text>
          <Text style={styles.message}>{toast.message}</Text>
          {toast.onUndo && (
            <TouchableOpacity onPress={handleUndo} style={styles.undoBtn} hitSlop={8}>
              <Text style={styles.undoLabel}>{toast.undoLabel ?? 'Undo'}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: { color: '#FFF', fontWeight: '700', fontSize: FontSize.md },
  message: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '500', flex: 1 },
  undoBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  undoLabel: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '700' },
});
