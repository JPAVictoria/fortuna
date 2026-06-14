import 'react-native-url-polyfill/auto';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import QueryProvider from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.background },
            }}>
            <Stack.Screen name="splash" options={{ animation: 'none' }} />
            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-expense" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="add-goal" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="add-deposit" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="add-category" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="auth/sign-in" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="auth/sign-up" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="auth/forgot-password" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
        </ToastProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
