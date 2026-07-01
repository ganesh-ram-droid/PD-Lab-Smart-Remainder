import { create } from 'zustand';

import {
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  sendResetEmail,
  subscribeToAuthChanges
} from '../services/firebaseService';

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified
  };
};

export const useAuthStore = create((set) => ({
  user: null,
  initializing: true,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  initializeAuth: () => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      set({
        user: normalizeUser(user),
        initializing: false
      });
    });

    return unsubscribe;
  },

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const user = await loginWithEmail(payload);
      set({ user: normalizeUser(user), loading: false });
      return user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const user = await registerWithEmail(payload);
      set({ user: normalizeUser(user), loading: false });
      return user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      await sendResetEmail(email);
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });

    try {
      await logoutUser();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));
