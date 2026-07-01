import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import notificationService from '../services/notificationService';
import reminderService from '../services/reminderService';

const SETTINGS_KEY = 'notification.settings.v1';

const defaultSettings = {
  enablePushNotifications: true,
  enableSmartNotifications: true,
  enableContextAwareness: true,
  enableSound: true,
  enableVibration: true,
  enableHighPriorityAlerts: true,
  reminderPreview: true,
  notificationTone: 'Default'
};

const normalizeBoolean = (value, fallback = false) => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
};

const normalizeNotification = (item = {}) => ({
  notificationId: item.notificationId || item.id || '',
  reminderId: item.reminderId || item.reminder?.reminderId || '',
  userId: item.userId || '',
  title: item.title || item.reminder?.title || 'Untitled reminder',
  body: item.body || item.message || item.reminder?.description || '',
  category: item.category || item.reminder?.category || 'Personal',
  priority: item.priority || item.reminder?.priority || 'Low',
  type: item.type || 'Context Reminder',
  status: item.status || 'Pending',
  scheduledTime: item.scheduledTime || '',
  sentTime: item.sentTime || '',
  deliveredTime: item.deliveredTime || '',
  openedTime: item.openedTime || '',
  reminderTime: item.reminderTime || item.reminder?.reminderTime || '',
  reminderDate: item.reminderDate || item.reminder?.reminderDate || '',
  contextScore: Number(item.contextScore ?? 0),
  decisionReason: Array.isArray(item.decisionReason)
    ? item.decisionReason
    : typeof item.decisionReason === 'string'
      ? [item.decisionReason]
      : Array.isArray(item.reason)
        ? item.reason
        : [],
  decision: item.decision || item.notificationDecision || 'Suppressed',
  deviceToken: item.deviceToken || '',
  createdAt: item.createdAt || item.timestamp || '',
  updatedAt: item.updatedAt || item.createdAt || '',
  description: item.description || item.reminder?.description || '',
  notificationStatus: item.notificationStatus || item.status || 'Pending'
});

const sortByTimestamp = (a, b) => {
  const aTime = new Date(a.sentTime || a.updatedAt || a.createdAt || 0).getTime();
  const bTime = new Date(b.sentTime || b.updatedAt || b.createdAt || 0).getTime();
  return bTime - aTime;
};

const matchesSearch = (item, query) => {
  if (!query) return true;
  const haystack = `${item.title} ${item.category} ${item.body} ${item.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase().trim());
};

const matchesFilters = (item, filters) => {
  const dateRangeMatch =
    !filters.dateRange ||
    filters.dateRange === 'all' ||
    (() => {
      const itemDate = new Date(item.sentTime || item.createdAt || item.updatedAt || Date.now());
      const now = new Date();
      const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - itemDate.setHours(0, 0, 0, 0)) / 86400000);
      if (filters.dateRange === 'today') return diffDays === 0;
      if (filters.dateRange === 'yesterday') return diffDays === 1;
      if (filters.dateRange === '7') return diffDays >= 0 && diffDays <= 6;
      if (filters.dateRange === '30') return diffDays >= 0 && diffDays <= 29;
      return true;
    })();

  const categoryMatch = !filters.category || filters.category === 'all' || item.category === filters.category;
  const priorityMatch = !filters.priority || filters.priority === 'all' || item.priority === filters.priority;
  const statusMatch = !filters.status || filters.status === 'all' || item.status === filters.status;

  return dateRangeMatch && categoryMatch && priorityMatch && statusMatch;
};

const buildVisible = (notifications, searchQuery, filters) =>
  notifications
    .filter((item) => matchesSearch(item, searchQuery) && matchesFilters(item, filters))
    .sort(sortByTimestamp);

const refreshVisibleState = (set, state, notifications) => {
  const visibleNotifications = buildVisible(notifications, state.searchQuery, state.filters);
  set({
    notifications,
    visibleNotifications,
    groupedNotifications: groupByDate(visibleNotifications)
  });
};

const groupByDate = (notifications = []) => {
  const today = [];
  const yesterday = [];
  const earlier = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  notifications.forEach((item) => {
    const itemDate = new Date(item.sentTime || item.createdAt || item.updatedAt || Date.now());
    const normalized = new Date(itemDate);
    normalized.setHours(0, 0, 0, 0);

    if (normalized.getTime() === currentDate.getTime()) {
      today.push(item);
    } else if (normalized.getTime() === yesterdayDate.getTime()) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  });

  return [
    { title: 'Today', data: today.sort(sortByTimestamp) },
    { title: 'Yesterday', data: yesterday.sort(sortByTimestamp) },
    { title: 'Earlier', data: earlier.sort(sortByTimestamp) }
  ].filter((section) => section.data.length);
};

const persistSettings = async (settings) => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  visibleNotifications: [],
  groupedNotifications: [],
  currentNotification: null,
  loading: false,
  refreshing: false,
  error: null,
  searchQuery: '',
  filters: {
    dateRange: 'all',
    category: 'all',
    priority: 'all',
    status: 'all'
  },
  settings: defaultSettings,
  deviceToken: '',
  permissionStatus: 'unknown',
  incomingNotification: null,
  pendingNotificationId: null,
  pendingReminderId: null,

  clearError: () => set({ error: null }),

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    const state = get();
    refreshVisibleState(set, state, state.notifications);
  },

  setFilters: (updates) => {
    set((state) => ({ filters: { ...state.filters, ...updates } }));
    const state = get();
    refreshVisibleState(set, state, state.notifications);
  },

  resetFilters: () => {
    set({
      filters: {
        dateRange: 'all',
        category: 'all',
        priority: 'all',
        status: 'all'
      }
    });
    const state = get();
    refreshVisibleState(set, state, state.notifications);
  },

  setCurrentNotification: (currentNotification) => set({ currentNotification }),
  clearCurrentNotification: () => set({ currentNotification: null }),
  setIncomingNotification: (incomingNotification) => set({ incomingNotification }),
  clearIncomingNotification: () => set({ incomingNotification: null }),
  setPendingNotification: ({ notificationId, reminderId }) =>
    set({
      pendingNotificationId: notificationId || null,
      pendingReminderId: reminderId || null
    }),
  clearPendingNotification: () => set({ pendingNotificationId: null, pendingReminderId: null }),

  loadPreferences: async () => {
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

  updatePreference: async (key, value) => {
    const settings = { ...get().settings, [key]: value };
    set({ settings });
    try {
      await persistSettings(settings);
    } catch (error) {
      set({ error: error.message });
    }
  },

  updatePreferences: async (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    try {
      await persistSettings(settings);
    } catch (error) {
      set({ error: error.message });
    }
  },

  loadNotifications: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await notificationService.getNotificationHistory({ limit: 100, ...params });
      const items = Array.isArray(response)
        ? response
        : response.notifications || response.items || response.data || [];
      const notifications = items.map(normalizeNotification).sort(sortByTimestamp);
      const state = get();
      refreshVisibleState(set, state, notifications);
      set({ loading: false });

      return notifications;
    } catch (error) {
      set({
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  refreshNotifications: async () => {
    set({ refreshing: true, error: null });

    try {
      await get().loadNotifications();
      set({ refreshing: false });
    } catch (error) {
      set({ refreshing: false, error: error.message });
      throw error;
    }
  },

  loadNotificationById: async (notificationId) => {
    if (!notificationId) {
      throw new Error('Notification ID is required.');
    }

    set({ loading: true, error: null });

    try {
      const response = await notificationService.getNotificationById(notificationId);
      const notification = normalizeNotification(response.notification || response.data || response);
      set({
        currentNotification: notification,
        loading: false
      });
      return notification;
    } catch (error) {
      const fallback = get().notifications.find((item) => item.notificationId === notificationId);
      if (fallback) {
        set({ currentNotification: fallback, loading: false });
        return fallback;
      }

      set({
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  registerDeviceToken: async (token, platform = 'expo') => {
    if (!token) {
      throw new Error('Device token is required.');
    }

    try {
      const result = await notificationService.registerDeviceToken({
        deviceToken: token,
        platform
      });
      set({
        deviceToken: token,
        permissionStatus: 'granted'
      });
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  sendNotification: async (payload) => notificationService.sendNotification(payload),
  scheduleNotification: async (payload) => notificationService.scheduleNotification(payload),
  cancelNotification: async (payload) => notificationService.cancelNotification(payload),
  rescheduleNotification: async (payload) => notificationService.rescheduleNotification(payload),

  completeReminder: async ({ reminderId, notificationId }) => {
    if (!reminderId) {
      throw new Error('Reminder ID is required.');
    }

    set({ loading: true, error: null });

    try {
      const result = await reminderService.completeReminder(reminderId);
      if (notificationId) {
        await notificationService.cancelNotification({ notificationId, reminderId });
      }

      const updatedNotification = {
        ...get().currentNotification,
        status: 'Completed',
        notificationStatus: 'Completed'
      };

      set({
        currentNotification: updatedNotification,
        notifications: get().notifications.map((item) =>
          item.reminderId === reminderId ? { ...item, status: 'Completed', notificationStatus: 'Completed' } : item
        ),
        loading: false
      });
      refreshVisibleState(set, get(), get().notifications.map((item) =>
        item.reminderId === reminderId ? { ...item, status: 'Completed', notificationStatus: 'Completed' } : item
      ));
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  dismissReminder: async ({ notificationId, reminderId }) => {
    if (!notificationId && !reminderId) {
      throw new Error('Notification or reminder ID is required.');
    }

    set({ loading: true, error: null });

    try {
      const result = await notificationService.cancelNotification({ notificationId, reminderId });
      const notifications = get().notifications.map((item) =>
        item.notificationId === notificationId || item.reminderId === reminderId
          ? { ...item, status: 'Dismissed', notificationStatus: 'Dismissed' }
          : item
      );

      set({
        currentNotification:
          get().currentNotification?.notificationId === notificationId
            ? { ...get().currentNotification, status: 'Dismissed', notificationStatus: 'Dismissed' }
            : get().currentNotification,
        loading: false
      });
      refreshVisibleState(set, get(), notifications);
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  snoozeReminder: async ({ reminderId, notificationId, snoozeMinutes = 10 }) => {
    if (!reminderId) {
      throw new Error('Reminder ID is required.');
    }

    set({ loading: true, error: null });

    try {
      const result = await reminderService.snoozeReminder(reminderId, { snoozeMinutes });
      await notificationService.rescheduleNotification({
        notificationId,
        reminderId,
        snoozeMinutes
      });

      const notifications = get().notifications.map((item) =>
        item.reminderId === reminderId ? { ...item, status: 'Snoozed', notificationStatus: 'Snoozed' } : item
      );
      set({
        currentNotification:
          get().currentNotification?.reminderId === reminderId
            ? { ...get().currentNotification, status: 'Snoozed', notificationStatus: 'Snoozed' }
            : get().currentNotification,
        loading: false
      });
      refreshVisibleState(set, get(), notifications);
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));
