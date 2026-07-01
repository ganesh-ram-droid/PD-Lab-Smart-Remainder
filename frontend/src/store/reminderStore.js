import { create } from 'zustand';

import reminderService from '../services/reminderService';

const priorityRank = {
  High: 3,
  Medium: 2,
  Low: 1
};

const normalizeBoolean = (value, fallback = false) => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
};

const normalizeRepeatDays = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeReminder = (item = {}) => ({
  reminderId: item.reminderId || item.id || '',
  title: item.title || 'Untitled reminder',
  description: item.description || '',
  category: item.category || 'Personal',
  priority: item.priority || 'Low',
  reminderDate: item.reminderDate || '',
  reminderTime: item.reminderTime || '',
  repeat: item.repeat || 'None',
  repeatDays: normalizeRepeatDays(item.repeatDays),
  location: item.location || '',
  latitude: item.latitude ?? '',
  longitude: item.longitude ?? '',
  radius: item.radius != null ? String(item.radius) : '100',
  status: item.status || 'Pending',
  notificationStatus: item.notificationStatus || item.status || 'Pending',
  notificationEnabled: normalizeBoolean(item.notificationEnabled, true),
  contextEnabled: normalizeBoolean(item.contextEnabled, true),
  isActive: normalizeBoolean(item.isActive, true),
  notes: item.notes || '',
  createdAt: item.createdAt || null,
  updatedAt: item.updatedAt || null
});

const statusOrder = {
  Upcoming: 0,
  Pending: 0,
  Scheduled: 0,
  Snoozed: 1,
  Missed: 2,
  Completed: 3,
  Cancelled: 4
};

const matchesSearch = (reminder, searchQuery) => {
  if (!searchQuery) {
    return true;
  }

  const text = `${reminder.title} ${reminder.category} ${reminder.description}`.toLowerCase();
  return text.includes(searchQuery.toLowerCase().trim());
};

const matchesStatus = (reminder, status) => {
  if (!status || status === 'all') {
    return true;
  }

  if (status === 'Upcoming') {
    return !['Completed', 'Missed', 'Cancelled', 'Snoozed'].includes(reminder.status);
  }

  return reminder.status === status;
};

const matchesFilters = (reminder, filters = {}) => {
  const categoryMatch = !filters.category || filters.category === 'all' || reminder.category === filters.category;
  const priorityMatch = !filters.priority || filters.priority === 'all' || reminder.priority === filters.priority;
  const statusMatch = matchesStatus(reminder, filters.status);
  const contextMatch =
    !filters.contextEnabled ||
    filters.contextEnabled === 'all' ||
    normalizeBoolean(reminder.contextEnabled) === (filters.contextEnabled === 'true' || filters.contextEnabled === true);
  const dateMatch = !filters.date || reminder.reminderDate === filters.date;

  return categoryMatch && priorityMatch && statusMatch && contextMatch && dateMatch;
};

const sortReminders = (reminders, sorting = 'newest') => {
  const list = [...reminders];

  if (sorting === 'priority') {
    return list.sort((a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0));
  }

  if (sorting === 'reminderDate') {
    return list.sort((a, b) => {
      const aDate = new Date(`${a.reminderDate || ''}T${a.reminderTime || '00:00'}:00`).getTime();
      const bDate = new Date(`${b.reminderDate || ''}T${b.reminderTime || '00:00'}:00`).getTime();
      return aDate - bDate;
    });
  }

  return list.sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    if (sorting === 'oldest') {
      return aTime - bTime;
    }
    return bTime - aTime;
  });
};

const buildVisibleReminders = (reminders, searchQuery, filters, sorting) => {
  const filtered = reminders.filter(
    (reminder) => matchesSearch(reminder, searchQuery) && matchesFilters(reminder, filters)
  );

  return sortReminders(filtered, sorting);
};

const syncVisibleReminders = (set, get) => {
  const state = get();
  set({
    visibleReminders: buildVisibleReminders(
      state.reminders,
      state.searchQuery,
      state.filters,
      state.sorting
    )
  });
};

const mapRequestParams = (state) => {
  const params = {};

  if (state.searchQuery) params.search = state.searchQuery;
  if (state.filters.category && state.filters.category !== 'all') params.category = state.filters.category;
  if (state.filters.priority && state.filters.priority !== 'all') params.priority = state.filters.priority;
  if (state.filters.status && state.filters.status !== 'all') params.status = state.filters.status;
  if (state.filters.date) params.date = state.filters.date;
  if (state.filters.contextEnabled && state.filters.contextEnabled !== 'all') {
    params.contextEnabled = state.filters.contextEnabled;
  }

  params.sortBy = state.sorting;
  return params;
};

export const useReminderStore = create((set, get) => ({
  reminders: [],
  visibleReminders: [],
  currentReminder: null,
  loading: false,
  saving: false,
  error: null,
  searchQuery: '',
  filters: {
    category: 'all',
    priority: 'all',
    status: 'all',
    date: '',
    contextEnabled: 'all'
  },
  sorting: 'newest',

  clearError: () => set({ error: null }),

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    syncVisibleReminders(set, get);
  },

  setFilters: (updates) => {
    set((state) => ({ filters: { ...state.filters, ...updates } }));
    syncVisibleReminders(set, get);
  },

  resetFilters: () => {
    set({
      filters: {
        category: 'all',
        priority: 'all',
        status: 'all',
        date: '',
        contextEnabled: 'all'
      }
    });
    syncVisibleReminders(set, get);
  },

  setSorting: (sorting) => {
    set({ sorting });
    syncVisibleReminders(set, get);
  },

  clearCurrentReminder: () => set({ currentReminder: null }),

  loadReminders: async () => {
    set({ loading: true, error: null });

    try {
      const state = get();
      const response = await reminderService.getReminders(mapRequestParams(state));
      const rawList = Array.isArray(response)
        ? response
        : response.reminders || response.items || response.data || [];
      const reminders = rawList.map(normalizeReminder);

      set({ reminders, loading: false });
      syncVisibleReminders(set, get);
      return reminders;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadReminderById: async (reminderId) => {
    set({ loading: true, error: null });

    try {
      const response = await reminderService.getReminderById(reminderId);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      set({ currentReminder: reminder, loading: false });
      return reminder;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createReminder: async (payload) => {
    set({ saving: true, error: null });

    try {
      const response = await reminderService.createReminder(payload);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      const reminders = [reminder, ...get().reminders];

      set({
        reminders,
        currentReminder: reminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return reminder;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  updateReminder: async (reminderId, payload) => {
    set({ saving: true, error: null });

    try {
      const response = await reminderService.updateReminder(reminderId, payload);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      const reminders = get().reminders.map((item) => (item.reminderId === reminderId ? reminder : item));

      set({
        reminders,
        currentReminder: reminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return reminder;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  deleteReminder: async (reminderId, payload = {}) => {
    set({ saving: true, error: null });

    try {
      await reminderService.deleteReminder(reminderId, payload);
      const reminders = get().reminders.filter((item) => item.reminderId !== reminderId);

      set({
        reminders,
        currentReminder:
          get().currentReminder?.reminderId === reminderId ? null : get().currentReminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return true;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  completeReminder: async (reminderId) => {
    set({ saving: true, error: null });

    try {
      const response = await reminderService.completeReminder(reminderId);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      const reminders = get().reminders.map((item) => (item.reminderId === reminderId ? reminder : item));

      set({
        reminders,
        currentReminder: reminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return reminder;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  snoozeReminder: async (reminderId, payload = {}) => {
    set({ saving: true, error: null });

    try {
      const response = await reminderService.snoozeReminder(reminderId, payload);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      const reminders = get().reminders.map((item) => (item.reminderId === reminderId ? reminder : item));

      set({
        reminders,
        currentReminder: reminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return reminder;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  },

  toggleReminder: async (reminderId, payload = {}) => {
    set({ saving: true, error: null });

    try {
      const response = await reminderService.toggleReminder(reminderId, payload);
      const reminder = normalizeReminder(response.reminder || response.data || response);
      const reminders = get().reminders.map((item) => (item.reminderId === reminderId ? reminder : item));

      set({
        reminders,
        currentReminder: reminder,
        saving: false
      });
      syncVisibleReminders(set, get);
      return reminder;
    } catch (error) {
      set({ error: error.message, saving: false });
      throw error;
    }
  }
}));
