import { create } from 'zustand';

import contextService from '../services/contextService';
import reminderService from '../services/reminderService';

const normalizeEvaluation = (response = {}) => {
  const data = response.context || response.evaluation || response.data || response;

  return {
    contextId: data.contextId || data.id || '',
    reminderId: data.reminderId || '',
    userId: data.userId || '',
    score: Number(data.contextScore ?? data.score ?? 0),
    decision: data.decision || 'Suppressed',
    reason: Array.isArray(data.reason)
      ? data.reason
      : Array.isArray(data.reasons)
        ? data.reasons
        : typeof data.reason === 'string'
          ? [data.reason]
          : [],
    currentTime: data.currentTime || new Date().toISOString(),
    currentActivity: data.currentActivity || 'Unknown',
    currentLatitude: data.currentLatitude ?? null,
    currentLongitude: data.currentLongitude ?? null,
    distance: data.distance ?? null,
    batteryLevel: data.batteryLevel ?? null,
    batteryStatus: data.batteryStatus || '',
    networkStatus: data.networkStatus || 'Unknown',
    geofenceStatus: data.geofenceStatus || (data.locationMatched ? 'Inside Geofence' : 'Outside Geofence'),
    isInsideGeofence: Boolean(data.locationMatched ?? data.isInsideGeofence),
    reminderRadius: data.radius ?? data.reminderRadius ?? null,
    estimatedArrival: data.estimatedArrival || '',
    scoreBreakdown: data.scoreBreakdown || {
      location: data.locationScore ?? 0,
      time: data.timeScore ?? 0,
      activity: data.activityScore ?? 0,
      history: data.historyScore ?? 0,
      priority: data.priorityScore ?? 0,
      battery: data.batteryScore ?? 0,
      network: data.networkScore ?? 0
    }
  };
};

const normalizeHistoryItem = (item = {}) => ({
  contextId: item.contextId || item.id || '',
  reminderId: item.reminderId || '',
  score: Number(item.contextScore ?? item.score ?? 0),
  decision: item.decision || 'Suppressed',
  currentActivity: item.currentActivity || 'Unknown',
  currentTime: item.currentTime || item.timestamp || new Date().toISOString(),
  reason: Array.isArray(item.reason)
    ? item.reason
    : typeof item.reason === 'string'
      ? [item.reason]
      : [],
  timestamp: item.createdAt || item.timestamp || new Date().toISOString()
});

const normalizeProfile = (response = {}) => {
  const data = response.profile || response.data || response;

  return {
    userId: data.userId || '',
    completionRate: Number(data.completionRate ?? 0),
    ignoreRate: Number(data.ignoreRate ?? 0),
    preferredReminderTime: data.preferredReminderTime || 'Unknown',
    preferredActivity: data.preferredActivity || 'Unknown',
    adaptiveWeight: Number(data.adaptiveWeight ?? 0),
    averageResponseTime: Number(data.averageResponseTime ?? 0)
  };
};

const normalizeReminder = (item = {}) => ({
  reminderId: item.reminderId || item.id || '',
  title: item.title || 'Untitled reminder',
  category: item.category || 'Personal',
  priority: item.priority || 'Low',
  status: item.status || 'Pending',
  reminderDate: item.reminderDate || '',
  reminderTime: item.reminderTime || '',
  latitude: item.latitude ?? null,
  longitude: item.longitude ?? null,
  radius: item.radius ?? null,
  estimatedArrival: item.estimatedArrival || '',
  distance: item.distance ?? null
});

export const useContextStore = create((set, get) => ({
  contextScore: 0,
  decision: 'Suppressed',
  currentContext: null,
  history: [],
  behaviorProfile: null,
  currentReminder: null,
  loading: false,
  refreshing: false,
  error: null,

  clearError: () => set({ error: null }),

  setCurrentReminder: (currentReminder) => set({ currentReminder }),

  loadHistory: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await contextService.getContextHistory(params);
      const history = Array.isArray(response)
        ? response
        : response.history || response.items || response.data || [];

      set({
        history: history.map(normalizeHistoryItem),
        loading: false
      });
      return history;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadBehaviorProfile: async (params = {}) => {
    try {
      const response = await contextService.getBehaviorProfile(params);
      const behaviorProfile = normalizeProfile(response);
      set({ behaviorProfile });
      return behaviorProfile;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  loadCurrentScore: async (reminderId, payload = {}) => {
    if (!reminderId) {
      throw new Error('Reminder ID is required.');
    }

    set({ loading: true, error: null, currentReminder: { ...get().currentReminder, reminderId } });

    try {
      const response = await contextService.getContextScore(reminderId, payload);
      const evaluation = normalizeEvaluation(response);
      set({
        contextScore: evaluation.score,
        decision: evaluation.decision,
        currentContext: evaluation,
        currentReminder: {
          ...(get().currentReminder || {}),
          reminderId,
          title: response.reminder?.title || response.title || get().currentReminder?.title || 'Reminder'
        },
        loading: false
      });
      return evaluation;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  evaluateContext: async (payload = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await contextService.evaluateContext(payload);
      const evaluation = normalizeEvaluation(response);

      set({
        contextScore: evaluation.score,
        decision: evaluation.decision,
        currentContext: evaluation,
        currentReminder: response.reminder
          ? normalizeReminder(response.reminder)
          : get().currentReminder,
        loading: false
      });

      return evaluation;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  refreshContext: async (reminderId) => {
    set({ refreshing: true, error: null });

    try {
      const [scoreResult, historyResult, profileResult] = await Promise.all([
        reminderId ? contextService.getContextScore(reminderId) : Promise.resolve(null),
        contextService.getContextHistory({ limit: 10 }),
        contextService.getBehaviorProfile()
      ]);

      const evaluation = scoreResult ? normalizeEvaluation(scoreResult) : get().currentContext;
      const history = Array.isArray(historyResult)
        ? historyResult
        : historyResult?.history || historyResult?.items || historyResult?.data || [];

      set({
        contextScore: evaluation?.score || 0,
        decision: evaluation?.decision || 'Suppressed',
        currentContext: evaluation || null,
        history: history.map(normalizeHistoryItem),
        behaviorProfile: normalizeProfile(profileResult),
        refreshing: false
      });

      return evaluation;
    } catch (error) {
      set({ error: error.message, refreshing: false });
      throw error;
    }
  },

  loadDashboardData: async (reminderId) => {
    set({ loading: true, error: null });

    try {
      const [currentLocation, contextScore, historyResult, profileResult, reminderResult] = await Promise.all([
        contextService.getDeviceContext(),
        reminderId ? contextService.getContextScore(reminderId) : Promise.resolve(null),
        contextService.getContextHistory({ limit: 10 }),
        contextService.getBehaviorProfile(),
        reminderId ? reminderService.getReminderById(reminderId) : Promise.resolve(null)
      ]);

      const evaluation = contextScore ? normalizeEvaluation(contextScore) : null;
      const history = Array.isArray(historyResult)
        ? historyResult
        : historyResult?.history || historyResult?.items || historyResult?.data || [];

      set({
        contextScore: evaluation?.score || 0,
        decision: evaluation?.decision || 'Suppressed',
        currentContext: evaluation || {
          currentLatitude: currentLocation.currentLatitude,
          currentLongitude: currentLocation.currentLongitude,
          currentTime: currentLocation.currentTime,
          currentActivity: 'Unknown',
          scoreBreakdown: {}
        },
        history: history.map(normalizeHistoryItem),
        behaviorProfile: normalizeProfile(profileResult),
        currentReminder: reminderResult ? normalizeReminder(reminderResult.reminder || reminderResult) : get().currentReminder,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));
