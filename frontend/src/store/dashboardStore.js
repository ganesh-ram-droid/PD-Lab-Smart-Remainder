import { create } from 'zustand';

import dashboardService from '../services/dashboardService';

const normalizeReminders = (reminders = []) => {
  return reminders.map((item) => ({
    reminderId: item.reminderId,
    title: item.title || 'Untitled reminder',
    category: item.category || 'Personal',
    priority: item.priority || 'Low',
    reminderDate: item.reminderDate || null,
    reminderTime: item.reminderTime || null,
    status: item.status || 'Pending',
    updatedAt: item.updatedAt || item.createdAt || null,
    createdAt: item.createdAt || null,
    location: item.location || '',
    description: item.description || '',
    radius: item.radius || null,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null
  }));
};

const initialStatistics = {
  todaysReminders: 0,
  upcomingReminders: 0,
  completedToday: 0,
  pendingToday: 0,
  missedToday: 0,
  highPriorityReminders: 0,
  averageContextScore: 0,
  completionPercentage: 0
};

export const useDashboardStore = create((set, get) => ({
  dashboard: null,
  upcomingReminders: [],
  recentActivity: {
    completed: [],
    snoozed: [],
    dismissed: []
  },
  contextCard: {
    currentActivity: 'Unknown',
    currentLocation: 'Unknown',
    contextScore: 0
  },
  statistics: initialStatistics,
  loading: false,
  refreshing: false,
  error: null,

  clearError: () => set({ error: null }),

  loadDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const result = await dashboardService.getDashboardBundle();
      const reminders = normalizeReminders(result.reminders || result.dashboard?.reminders || []);
      const analytics = result.dashboard || {};
      const dashboardBlock = analytics.dashboard || analytics;

      const upcomingReminders = reminders
        .filter((reminder) => reminder.status !== 'Completed' && reminder.status !== 'Cancelled')
        .sort((a, b) => {
          const aDate = `${a.reminderDate || ''}T${a.reminderTime || '00:00'}:00`;
          const bDate = `${b.reminderDate || ''}T${b.reminderTime || '00:00'}:00`;
          return new Date(aDate) - new Date(bDate);
        })
        .slice(0, 5);

      const recentCompleted = reminders
        .filter((reminder) => reminder.status === 'Completed')
        .slice(0, 3);
      const recentSnoozed = reminders
        .filter((reminder) => reminder.status === 'Snoozed')
        .slice(0, 3);
      const recentDismissed = reminders
        .filter((reminder) => reminder.status === 'Dismissed' || reminder.status === 'Cancelled')
        .slice(0, 3);

      set({
        dashboard: dashboardBlock,
        upcomingReminders,
        recentActivity: {
          completed: recentCompleted,
          snoozed: recentSnoozed,
          dismissed: recentDismissed
        },
        contextCard: {
          currentActivity: analytics.contextAnalytics?.contexts?.[0]?.currentActivity || 'Unknown',
          currentLocation:
            analytics.location?.mostVisitedReminderLocation ||
            (analytics.contextAnalytics?.contexts?.[0]?.currentLatitude != null
              ? `${analytics.contextAnalytics.contexts[0].currentLatitude}, ${analytics.contextAnalytics.contexts[0].currentLongitude ?? '--'}`
              : 'Unknown'),
          contextScore: analytics.contextAnalytics?.averageContextScore || 0
        },
        statistics: {
          todaysReminders: dashboardBlock.todaysReminders || 0,
          upcomingReminders: dashboardBlock.upcomingReminders || 0,
          completedToday: dashboardBlock.completedToday || 0,
          pendingToday: dashboardBlock.pendingToday || 0,
          missedToday: dashboardBlock.missedToday || 0,
          highPriorityReminders: dashboardBlock.highPriorityReminders || 0,
          averageContextScore: dashboardBlock.averageContextScore || 0,
          completionPercentage: dashboardBlock.completionPercentage || 0
        },
        loading: false,
        refreshing: false
      });

      return result;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        refreshing: false
      });
      throw error;
    }
  },

  refreshDashboard: async () => {
    set({ refreshing: true, error: null });

    try {
      const result = await dashboardService.getDashboardBundle();
      const reminders = normalizeReminders(result.reminders || result.dashboard?.reminders || []);
      const analytics = result.dashboard || {};
      const dashboardBlock = analytics.dashboard || analytics;

      const upcomingReminders = reminders
        .filter((reminder) => reminder.status !== 'Completed' && reminder.status !== 'Cancelled')
        .sort((a, b) => {
          const aDate = `${a.reminderDate || ''}T${a.reminderTime || '00:00'}:00`;
          const bDate = `${b.reminderDate || ''}T${b.reminderTime || '00:00'}:00`;
          return new Date(aDate) - new Date(bDate);
        })
        .slice(0, 5);

      const recentCompleted = reminders
        .filter((reminder) => reminder.status === 'Completed')
        .slice(0, 3);
      const recentSnoozed = reminders
        .filter((reminder) => reminder.status === 'Snoozed')
        .slice(0, 3);
      const recentDismissed = reminders
        .filter((reminder) => reminder.status === 'Dismissed' || reminder.status === 'Cancelled')
        .slice(0, 3);

      set({
        dashboard: dashboardBlock,
        upcomingReminders,
        recentActivity: {
          completed: recentCompleted,
          snoozed: recentSnoozed,
          dismissed: recentDismissed
        },
        contextCard: {
          currentActivity: analytics.contextAnalytics?.contexts?.[0]?.currentActivity || 'Unknown',
          currentLocation:
            analytics.location?.mostVisitedReminderLocation ||
            (analytics.contextAnalytics?.contexts?.[0]?.currentLatitude != null
              ? `${analytics.contextAnalytics.contexts[0].currentLatitude}, ${analytics.contextAnalytics.contexts[0].currentLongitude ?? '--'}`
              : 'Unknown'),
          contextScore: analytics.contextAnalytics?.averageContextScore || 0
        },
        statistics: {
          todaysReminders: dashboardBlock.todaysReminders || 0,
          upcomingReminders: dashboardBlock.upcomingReminders || 0,
          completedToday: dashboardBlock.completedToday || 0,
          pendingToday: dashboardBlock.pendingToday || 0,
          missedToday: dashboardBlock.missedToday || 0,
          highPriorityReminders: dashboardBlock.highPriorityReminders || 0,
          averageContextScore: dashboardBlock.averageContextScore || 0,
          completionPercentage: dashboardBlock.completionPercentage || 0
        },
        loading: false,
        refreshing: false
      });

      return result;
    } catch (error) {
      set({
        error: error.message,
        refreshing: false
      });
      throw error;
    }
  }
}));
