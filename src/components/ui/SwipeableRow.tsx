import { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  children: React.ReactNode;
  onDelete: () => void;
};

export function SwipeableRow({ children, onDelete }: Props) {
  const theme = useTheme();
  const swipeRef = useRef<Swipeable>(null);

  function renderRightActions(progress: Animated.AnimatedInterpolation<number>) {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: theme.error }]}
          onPress={() => {
            swipeRef.current?.close();
            onDelete();
          }}>
          <Text style={styles.deleteIcon}>🗑</Text>
          <Text style={styles.deleteLabel}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Swipeable ref={swipeRef} renderRightActions={renderRightActions} overshootRight={false}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: { width: 80, justifyContent: 'center' },
  deleteBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  deleteIcon: { fontSize: 18 },
  deleteLabel: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '600' },
});
