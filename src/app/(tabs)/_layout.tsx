import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors, FontSize } from '@/constants/theme';

const MODAL_PREFIXES = ['/add-', '/edit-', '/auth/'];
function isModalRoute(path: string) {
  return MODAL_PREFIXES.some(p => path.startsWith(p));
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: Record<string, { label: string; icon: IoniconName; iconFocused: IoniconName }> = {
  index: { label: 'Dashboard', icon: 'home-outline', iconFocused: 'home' },
  expenses: { label: 'Expenses', icon: 'card-outline', iconFocused: 'card' },
  savings: { label: 'Savings', icon: 'wallet-outline', iconFocused: 'wallet' },
  settings: { label: 'Settings', icon: 'settings-outline', iconFocused: 'settings' },
};

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const pathname = usePathname();
  const modalOpen = isModalRoute(pathname);

  return (
    <Tabs
      screenOptions={({ route }) => {
        const cfg = TAB_CONFIG[route.name];
        return {
          headerShown: false,
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: modalOpen
            ? { display: 'none' }
            : {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.tabBarBorder,
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: FontSize.xs,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarLabel: cfg?.label ?? route.name,
          tabBarIcon: ({ focused, color, size }) =>
            cfg ? (
              <Ionicons
                name={focused ? cfg.iconFocused : cfg.icon}
                size={size}
                color={color}
              />
            ) : null,
        };
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="expenses" />
      <Tabs.Screen name="savings" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
