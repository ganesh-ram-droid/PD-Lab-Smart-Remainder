import { create } from 'zustand';

import analyticsService from '../services/analyticsService';

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeDashboard = (response = {}) => {
  const data = response.dashboard || response.data || response;

  return {
    completionRate: asNumber(data.completionRate),
    pendingReminders: asNumber(data.pendingReminders),
    missedReminders: asNumber(data.missedReminders),
    cancelledReminders: asNumber(data.cancelledReminders),
    snoozedReminders: asNumber(data.snoozedReminders),
    todaysReminders: asNumber(data.todaysReminders),
    weeklyReminders: asNumber(data.weeklyReminders),
    monthlyReminders: asNumber(data.monthlyReminders),
    averageContextScore: asNumber(data.averageContextScore),
    averageResponseTime: asNumber(data.averageResponseTime),
    notificationSuccessRate: asNumber(data.notificationSuccessRate),
    completionPercentage: asNumber(data.completionPercentage || data.completionRate)
  };
};

const normalizeChartData = (data = []) =>
  normalizeArray(data).map((item) => ({
    label: item.label || item.name || item.date || '',
    value: asNumber(item.value ?? item.count ?? item.score ?? 0),
    color: item.color || '#2563EB',
    metadata: item.metadata || {}
  }));

export const useAnalyticsStore = create((set, get) => ({
  dashboard: null,
  reminderAnalytics: null,
  contextAnalytics: null,
  behaviorAnalytics: null,
  locationAnalytics: null,
  charts: {
    weeklyCompletion: [],
    monthlyCompletion: [],
    contextScoreTrend: [],
    reminderCategoryDistribution: [],
    notificationSuccess: [],
    behaviorTrend: [],
    locationTrend: []
  },
  loading: false,
  refreshing: false,
  error: null,
  filters: {
    dateRange: 'all',
    category: 'all',
    priority: 'all',
    status: 'all'
  },

  clearError: () => set({ error: null }),

  setFilters: (updates) => set((state) => ({ filters: { ...state.filters, ...updates } })),

  resetFilters: () =>
    set({
      filters: {
        dateRange: 'all',
        category: 'all',
        priority: 'all',
        status: 'all'
      }
    }),

  loadAnalytics: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const filters = { ...get().filters, ...params };
      const [dashboard, reminders, context, behavior, location, charts] = await Promise.all([
        analyticsService.getAnalyticsDashboard(filters),
        analyticsService.getReminderAnalytics(filters),
        analyticsService.getContextAnalytics(filters),
        analyticsService.getBehaviorAnalytics(filters),
        analyticsService.getLocationAnalytics(filters),
        analyticsService.getAnalyticsCharts(filters)
      ]);

      const normalizedCharts = charts?.charts || charts || {};

      set({
        dashboard: normalizeDashboard(dashboard),
        reminderAnalytics: reminders?.reminders || reminders?.data || reminders,
        contextAnalytics: context?.context || context?.data || context,
        behaviorAnalytics: behavior?.behavior || behavior?.data || behavior,
        locationAnalytics: location?.location || location?.data || location,
        charts: {
          weeklyCompletion: normalizeChartData(normalizedCharts.weeklyCompletion || normalizedCharts.weekly || []),
          monthlyCompletion: normalizeChartData(normalizedCharts.monthlyCompletion || normalizedCharts.monthly || []),
          contextScoreTrend: normalizeChartData(normalizedCharts.contextScoreTrend || normalizedCharts.context || []),
          reminderCategoryDistribution: normalizeChartData(normalizedCharts.reminderCategoryDistribution || normalizedCharts.categories || []),
          notificationSuccess: normalizeChartData(normalizedCharts.notificationSuccess || normalizedCharts.notifications || []),
          behaviorTrend: normalizeChartData(normalizedCharts.behaviorTrend || normalizedCharts.behavior || []),
          locationTrend: normalizeChartData(normalizedCharts.locationTrend || normalizedCharts.location || [])
        },
        loading: false
      });

      return {
        dashboard,
        reminders,
        context,
        behavior,
        location,
        charts
      };
    } catch (error) {
      set({
        error: error.message,
        loading: false
      });
      throw error;
    }
  },

  refreshAnalytics: async () => {
    set({ refreshing: true, error: null });

    try {
      await get().loadAnalytics();
      set({ refreshing: false });
    } catch (error) {
      set({ refreshing: false, error: error.message });
      throw error;
    }
  }
}));
