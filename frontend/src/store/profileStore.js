import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import profileService from '../services/profileService';
import { useAuthStore } from './authStore';

const SETTINGS_KEY = 'profile.settings.v1';

const defaultSettings = {
  notificationEnabled: true,
  contextAwarenessEnabled: true,
  smartReminderEnabled: true,
  locationServicesEnabled: true,
  darkModeEnabled: false,
  language: 'English'
};

const normalizeProfile = (data = {}) => ({
  uid: data.uid || '',
  name: data.name || data.displayName || '',
  email: data.email || '',
  phone: data.phone || '',
  photoURL: data.photoURL || '',
  createdAt: data.createdAt || '',
  updatedAt: data.updatedAt || '',
  isActive: data.isActive ?? true,
  notificationEnabled: data.notificationEnabled ?? true,
  theme: data.theme || 'light'
});

const persistSettings = async (settings) => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const useProfileStore = create((set, get) => ({
  profile: null,
  settings: defaultSettings,
  loading: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        set({ settings: { ...defaultSettings, ...JSON.parse(stored) } });
      }
      return get().settings;
    } catch (error) {
      set({ error: error.message });
      return get().settings;
    }
  },

  updateSetting: async (key, value) => {
    const settings = { ...get().settings, [key]: value };
    set({ settings });
    try {
      await persistSettings(settings);
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateSettings: async (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    try {
      await persistSettings(settings);
    } catch (error) {
      set({ error: error.message });
    }
  },

  loadProfile: async () => {
    set({ loading: true, error: null });

    try {
      const response = await profileService.getProfile();
      const profile = normalizeProfile(response.profile || response.data || response);
      set({ profile, loading: false });

      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              displayName: profile.name || state.user.displayName,
              photoURL: profile.photoURL || state.user.photoURL,
              email: profile.email || state.user.email
            }
          : state.user
      }));

      return profile;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProfile: async (payload) => {
    set({ saving: true, error: null });

    try {
      const response = await profileService.updateProfileData(payload);
      const profile = normalizeProfile(response.profile || response.data || response);
      set({ profile, saving: false });

      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              displayName: profile.name || state.user.displayName,
              photoURL: profile.photoURL || state.user.photoURL
            }
          : state.user
      }));

      return profile;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  logout: async () => {
    set({ saving: true, error: null });

    try {
      await profileService.logoutAccount();
      set({ saving: false, profile: null });
      useAuthStore.setState({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ saving: true, error: null });

    try {
      await profileService.deleteAccount();
      set({ saving: false, profile: null });
      useAuthStore.setState({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  }
}));
