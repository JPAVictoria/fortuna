import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const COLORS = ['#10B981', '#34D399', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];
const COUNT = 36;

type Particle = {
  x: Animated.Value;
  y: Animated.Value;
  rot: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  startX: number;
};

type Props = { visible: boolean; onDone?: () => void };

export function Confetti({ visible, onDone }: Props) {
  const particles = useRef<Particle[]>(
    Array.from({ length: COUNT }, (_, i) => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(0),
      color: COLORS[i % COLORS.length],
      size: 7 + (i % 5) * 2,
      startX: (i / COUNT) * SCREEN_W + (Math.random() * 30 - 15),
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    const anims = particles.map((p, i) => {
      p.x.setValue(p.startX);
      p.y.setValue(-16);
      p.opacity.setValue(1);
      p.rot.setValue(0);

      const delay = (i % 12) * 60;
      const drift = (Math.random() - 0.5) * 160;
      const dur = 1800 + Math.random() * 800;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.y, { toValue: 520, duration: dur, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(p.x, { toValue: p.startX + drift, duration: dur, useNativeDriver: true }),
          Animated.timing(p.rot, { toValue: 6, duration: dur, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
            Animated.delay(dur - 500),
            Animated.timing(p.opacity, { toValue: 0, duration: 420, useNativeDriver: true }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(anims).start(() => onDone?.());
  }, [visible, onDone, particles]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: i % 3 === 0 ? p.size / 2 : 2,
            transform: [
              { translateX: p.x },
              { translateY: p.y },
              { rotate: p.rot.interpolate({ inputRange: [0, 6], outputRange: ['0deg', '1080deg'] }) },
            ],
            opacity: p.opacity,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
});
