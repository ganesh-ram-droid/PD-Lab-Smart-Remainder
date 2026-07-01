import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/themeStore';
import ToastHost from './src/components/common/ToastHost';

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);

  useEffect(() => {
    hydrateTheme().catch(() => null);
  }, [hydrateTheme]);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
      <ToastHost />
    </SafeAreaProvider>
  );
}
