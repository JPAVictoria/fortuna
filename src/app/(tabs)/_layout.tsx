import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors, FontSize } from '@/constants/theme';

const TAB_ICONS: Record<string, string> = {
  index: '⌂',
  expenses: '₿',
  savings: '◎',
  settings: '⚙',
};

const TAB_LABELS: Record<string, string> = {
  index: 'Dashboard',
  expenses: 'Expenses',
  savings: 'Savings',
  settings: 'Settings',
};

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, { active: string; inactive: string }> = {
    index: { active: '🏠', inactive: '🏠' },
    expenses: { active: '💳', inactive: '💳' },
    savings: { active: '🪙', inactive: '🪙' },
    settings: { active: '⚙️', inactive: '⚙️' },
  };

  const pair = icons[name] ?? { active: '●', inactive: '○' };
  return null; // icons rendered via tabBarLabel emoji trick below
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarLabel: TAB_LABELS[route.name] ?? route.name,
      })}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="expenses" />
      <Tabs.Screen name="savings" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
