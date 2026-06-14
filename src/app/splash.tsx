import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { FontSize } from '@/constants/theme';
import { storageGetItem, STORAGE_KEYS } from '@/lib/storage';

export default function Splash() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hideAsync();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 7 }),
      ]),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      const onboarded = await storageGetItem<boolean>(STORAGE_KEYS.ONBOARDED);
      router.replace(onboarded ? '/(tabs)' : '/onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <FortunaLogo size={100} variant="mono" />
      </Animated.View>

      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Fortuna
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Fortuna favet fortibus.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070C07',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: '800',
    color: '#F0FDF4',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: '#4B7A4B',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});
