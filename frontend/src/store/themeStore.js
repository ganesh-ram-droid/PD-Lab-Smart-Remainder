import { Appearance } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app.theme.v1';

const getInitialTheme = () => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  hydrated: false,
  hydrateTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        set({ theme: stored, hydrated: true });
        return stored;
      }
    } catch (error) {
      // Fall back to the system theme.
    }

    set({ hydrated: true });
    return getInitialTheme();
  },
  setTheme: async (theme) => {
    set({ theme });
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // Persistence failure should not block UI updates.
    }
  },
  toggleTheme: async () => {
    const nextTheme = useThemeStore.getState().theme === 'dark' ? 'light' : 'dark';
    await useThemeStore.getState().setTheme(nextTheme);
  }
}));
