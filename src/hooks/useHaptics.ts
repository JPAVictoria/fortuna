import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

function safe(fn: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
}

export function useHaptics() {
  return {
    light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
    medium: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
    heavy: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
    success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
    error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
    warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  };
}
