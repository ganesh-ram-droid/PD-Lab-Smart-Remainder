const reminderModel = require('../models/reminderModel');
const notificationModel = require('../models/notificationModel');
const contextModel = require('../models/contextModel');
const behaviorModel = require('../models/behaviorModel');
const locationModel = require('../models/locationModel');
const analyticsModel = require('../models/analyticsModel');
const statisticsService = require('./statisticsService');
const reportService = require('./reportService');
const { buildDailySeries, buildTrendSeries, buildCategorySeries } = require('../utils/chartFormatter');
const { round } = require('../utils/learningWeights');
const AppError = require('../utils/AppError');

const dashboardCache = new Map();
const DASHBOARD_CACHE_TTL_MS = 5 * 60 * 1000;

const getCacheKey = (userId, range = {}) => {
  return [
    userId,
    range.startDate || 'all',
    range.endDate || 'all',
    range.category || 'all',
    range.priority || 'all',
    range.status || 'all',
    range.location || 'all'
  ].join('|');
};

const isCached = (entry) => {
  if (!entry) {
    return false;
  }

  return Date.now() - entry.cachedAt < DASHBOARD_CACHE_TTL_MS;
};

const cacheDashboard = (key, value) => {
  dashboardCache.set(key, {
    cachedAt: Date.now(),
    value
  });
};

const readCache = (key) => {
  const entry = dashboardCache.get(key);

  if (!isCached(entry)) {
    dashboardCache.delete(key);
    return null;
  }

  return entry.value;
};

const normalizeFilters = (query = {}) => ({
  startDate: query.startDate || null,
  endDate: query.endDate || null,
  category: query.category || null,
  priority: query.priority || null,
  status: query.status || null,
  location: query.location || null,
  limit: query.limit ? Number(query.limit) : 50
});

const inDateRange = (dateValue, startDate, endDate) => {
  if (!dateValue) {
    return true;
  }

  const current = new Date(dateValue).getTime();
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate).getTime() : null;

  if (Number.isNaN(current)) {
    return false;
  }

  if (start && current < start) {
    return false;
  }

  if (end && current > end) {
    return false;
  }

  return true;
};

const filterReminders = (reminders, filters) =>
  reminders.filter((reminder) => {
    if (!inDateRange(reminder.createdAt, filters.startDate, filters.endDate)) {
      return false;
    }

    if (filters.category && reminder.category !== filters.category) {
      return false;
    }

    if (filters.priority && reminder.priority !== filters.priority) {
      return false;
    }

    if (filters.status && reminder.status !== filters.status) {
      return false;
    }

    if (filters.location && reminder.location !== filters.location) {
      return false;
    }

    return true;
  });

const filterByDateRange = (items, filters, dateField = 'createdAt') =>
  items.filter((item) => inDateRange(item[dateField], filters.startDate, filters.endDate));

const countStatuses = (items, statusField = 'status') => {
  const summary = {};
  items.forEach((item) => {
    const key = item[statusField] || 'Unknown';
    summary[key] = (summary[key] || 0) + 1;
  });
  return summary;
};

const getReminderAnalytics = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const reminders = filterReminders(await reminderModel.getUserReminders(userId), filters);
  const completed = reminders.filter((item) => item.status === 'Completed').length;
  const pending = reminders.filter((item) => item.status === 'Pending').length;
  const missed = reminders.filter((item) => item.status === 'Missed').length;
  const cancelled = reminders.filter((item) => item.status === 'Cancelled').length;
  const snoozed = reminders.filter((item) => item.status === 'Snoozed').length;
  const total = reminders.length;

  return {
    totalReminders: total,
    completedReminders: completed,
    pendingReminders: pending,
    missedReminders: missed,
    cancelledReminders: cancelled,
    snoozedReminders: snoozed,
    completionRate: statisticsService.calculateRate(completed, total),
    successRate: statisticsService.calculateRate(completed + pending, total),
    failureRate: statisticsService.calculateRate(missed + cancelled, total),
    categoryBreakdown: statisticsService.buildCountSummary(reminders, 'category', [
      'Medicine',
      'Shopping',
      'Meeting',
      'Work',
      'College',
      'Exercise',
      'Travel',
      'Bills',
      'Personal',
      'Custom'
    ]),
    priorityBreakdown: statisticsService.buildCountSummary(reminders, 'priority', [
      'High',
      'Medium',
      'Low'
    ]),
    statusBreakdown: countStatuses(reminders),
    reminders
  };
};

const getNotificationAnalytics = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const notifications = filterByDateRange(
    await notificationModel.getNotificationsByUser(userId, { limit: filters.limit }),
    filters
  );
  const notificationsSent = notifications.filter((item) => item.status === 'Sent').length;
  const delivered = notifications.filter((item) => item.status === 'Delivered').length;
  const opened = notifications.filter((item) => item.status === 'Opened').length;
  const dismissed = notifications.filter((item) => item.status === 'Dismissed').length;
  const suppressed = notifications.filter((item) => item.status === 'Suppressed').length;
  const failed = notifications.filter((item) => item.status === 'Failed').length;
  const sentToDelivered = notifications.filter((item) => item.sentTime && item.deliveredTime);
  const averageDeliveryTime = sentToDelivered.length
    ? round(
        sentToDelivered.reduce(
          (sum, item) =>
            sum + (new Date(item.deliveredTime).getTime() - new Date(item.sentTime).getTime()) / 1000,
          0
        ) / sentToDelivered.length
      )
    : 0;

  return {
    notificationsSent,
    delivered,
    opened,
    dismissed,
    suppressed,
    failed,
    averageDeliveryTime,
    openRate: statisticsService.calculateRate(opened, notificationsSent || notifications.length),
    suppressionRate: statisticsService.calculateRate(suppressed, notifications.length),
    deliveryRate: statisticsService.calculateRate(delivered, notificationsSent || notifications.length),
    notifications
  };
};

const getContextAnalytics = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const contexts = filterByDateRange(
    await contextModel.getContextLogsByUser(userId, { limit: filters.limit }),
    filters
  );
  const averageContextScore = statisticsService.calculateAverage(contexts, (item) => item.contextScore);
  const scores = contexts.map((item) => Number(item.contextScore || 0));

  const locationMatches = contexts.filter((item) => item.locationMatched).length;
  const timeMatches = contexts.filter((item) => item.timeMatched).length;
  const activityMatches = contexts.filter((item) => item.activityMatched).length;

  return {
    averageContextScore,
    highestContextScore: scores.length ? Math.max(...scores) : 0,
    lowestContextScore: scores.length ? Math.min(...scores) : 0,
    locationMatchPercentage: statisticsService.calculateRate(locationMatches, contexts.length),
    timeMatchPercentage: statisticsService.calculateRate(timeMatches, contexts.length),
    activityMatchPercentage: statisticsService.calculateRate(activityMatches, contexts.length),
    contextScoreHistory: buildTrendSeries(contexts, {
      dateField: 'createdAt',
      valueField: 'contextScore'
    }),
    contexts
  };
};

const getBehaviorAnalytics = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const behaviors = filterByDateRange(
    (await behaviorModel.getBehaviorLogsByUser(userId, { limit: filters.limit })).items,
    filters
  );
  const profile = await behaviorModel.getLearningProfile(userId);
  const counts = behaviors.reduce(
    (acc, behavior) => {
      acc.total += 1;
      if (behavior.action === 'Completed') acc.completed += 1;
      if (behavior.action === 'Ignored') acc.ignored += 1;
      if (behavior.action === 'Dismissed') acc.dismissed += 1;
      if (behavior.action === 'Snoozed') acc.snoozed += 1;
      if (behavior.action === 'Opened Notification') acc.opened += 1;
      if (behavior.action === 'Delayed Reminder') acc.delayed += 1;
      if (behavior.action === 'Cancelled Reminder') acc.cancelled += 1;
      return acc;
    },
    {
      total: 0,
      completed: 0,
      ignored: 0,
      dismissed: 0,
      snoozed: 0,
      opened: 0,
      delayed: 0,
      cancelled: 0
    }
  );

  return {
    totalBehaviorCount: counts.total,
    completedCount: counts.completed,
    ignoredCount: counts.ignored,
    dismissedCount: counts.dismissed,
    snoozedCount: counts.snoozed,
    openedCount: counts.opened,
    delayedCount: counts.delayed,
    cancelledCount: counts.cancelled,
    completionRate: profile?.completionRate || 0,
    ignoreRate: profile?.ignoreRate || 0,
    dismissRate: profile?.dismissRate || 0,
    averageResponseTime: profile?.averageResponseTime || 0,
    preferredReminderTime: profile?.preferredReminderTime || 'Unknown',
    preferredReminderDay: profile?.preferredReminderDay || 'Unknown',
    preferredReminderLocation: profile?.preferredLocation || null,
    mostSuccessfulReminderCategory: profile?.mostSuccessfulReminderCategory || 'Unknown',
    behaviorTrend: buildDailySeries(behaviors, { dateField: 'timestamp' }),
    behaviors,
    profile
  };
};

const getLocationAnalytics = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const locations = filterByDateRange(await locationModel.getLocationHistory(userId, filters.limit), filters, 'timestamp');
  const geofenceLogs = filterByDateRange(
    await locationModel.getGeofenceLogsByUser(userId, filters.limit),
    filters
  );

  const reminders = await reminderModel.getUserReminders(userId);

  let totalDistance = 0;
  let measuredCount = 0;
  let successfulGeofences = 0;

  geofenceLogs.forEach((log) => {
    if (log.distance !== null && log.distance !== undefined) {
      totalDistance += Number(log.distance);
      measuredCount += 1;
    }

    if (log.status === 'INSIDE_GEOFENCE') {
      successfulGeofences += 1;
    }
  });

  return {
    mostVisitedReminderLocation: statisticsService.topValue(
      reminders.filter((item) => item.location),
      (item) => item.location
    ) || 'Unknown',
    mostTriggeredGeofence: statisticsService.topValue(geofenceLogs, (item) => item.reminderId) || 'Unknown',
    averageDistanceFromReminder: measuredCount ? round(totalDistance / measuredCount) : 0,
    locationSuccessRate: statisticsService.calculateRate(successfulGeofences, geofenceLogs.length),
    locationHistory: locations,
    geofenceLogs
  };
};

const buildDashboardSummary = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const reminders = await reminderModel.getUserReminders(userId);
  const today = new Date().toISOString().slice(0, 10);
  const locationAnalytics = await getLocationAnalytics(userId, filters);
  const todayReminders = reminders.filter((reminder) => reminder.reminderDate === today || reminder.status === 'Pending');
  const completedToday = reminders.filter((reminder) => reminder.status === 'Completed' && reminder.updatedAt && new Date(reminder.updatedAt).toISOString().slice(0, 10) === today).length;
  const missedToday = reminders.filter((reminder) => reminder.status === 'Missed' && reminder.updatedAt && new Date(reminder.updatedAt).toISOString().slice(0, 10) === today).length;
  const pendingToday = reminders.filter((reminder) => reminder.status === 'Pending').length;
  const highPriorityReminders = reminders.filter((reminder) => reminder.priority === 'High').length;
  const notificationAnalytics = await getNotificationAnalytics(userId, filters);
  const contextAnalytics = await getContextAnalytics(userId, filters);
  const behaviorAnalytics = await getBehaviorAnalytics(userId, filters);

  const dashboard = {
    todaysReminders: todayReminders.length,
    upcomingReminders: reminders.filter((reminder) => reminder.reminderDate >= today && reminder.status !== 'Completed').length,
    completedToday,
    pendingToday,
    missedToday,
    highPriorityReminders,
    averageContextScore: contextAnalytics.averageContextScore,
    completionPercentage: statisticsService.calculateRate(
      reminders.filter((item) => item.status === 'Completed').length,
      reminders.length
    ),
    totalReminders: reminders.length
  };

  const analyticsId = `${userId}_${today}`;
  const analyticsDoc = await analyticsModel.upsertDailyAnalytics(analyticsId, {
    analyticsId,
    userId,
    date: today,
    totalReminders: reminders.length,
    completedReminders: reminders.filter((item) => item.status === 'Completed').length,
    missedReminders: reminders.filter((item) => item.status === 'Missed').length,
    ignoredReminders: behaviorAnalytics.ignoredCount,
    dismissedReminders: behaviorAnalytics.dismissedCount,
    snoozedReminders: reminders.filter((item) => item.status === 'Snoozed').length,
    notificationsSent: notificationAnalytics.notificationsSent,
    notificationsOpened: notificationAnalytics.opened,
    notificationsSuppressed: notificationAnalytics.suppressed,
    averageContextScore: contextAnalytics.averageContextScore,
    averageResponseTime: behaviorAnalytics.averageResponseTime,
    mostUsedCategory: statisticsService.topValue(reminders, (item) => item.category) || 'Unknown',
    mostVisitedLocation: locationAnalytics.mostVisitedReminderLocation || 'Unknown',
    preferredReminderTime: behaviorAnalytics.preferredReminderTime,
    completionRate: dashboard.completionPercentage
  });

  return {
    dashboard,
    analyticsDoc,
    notificationAnalytics,
    contextAnalytics,
    behaviorAnalytics
  };
};

const buildCharts = async (userId, query = {}) => {
  const filters = normalizeFilters(query);
  const reminders = filterByDateRange(await reminderModel.getUserReminders(userId), filters);
  const notifications = filterByDateRange(
    await notificationModel.getNotificationsByUser(userId, { limit: filters.limit }),
    filters
  );
  const contexts = filterByDateRange(
    await contextModel.getContextLogsByUser(userId, { limit: filters.limit }),
    filters
  );

  const daily = buildDailySeries(reminders, { dateField: 'createdAt' });
  const weekly = buildDailySeries(reminders, { dateField: 'createdAt' });
  const monthly = buildDailySeries(reminders, { dateField: 'createdAt' });
  const yearly = buildDailySeries(reminders, { dateField: 'createdAt' });

  return reportService.buildChartsResponse({
    daily,
    weekly,
    monthly,
    yearly,
    trends: {
      reminderTrend: buildTrendSeries(reminders, { dateField: 'createdAt' }),
      notificationTrend: buildTrendSeries(notifications, { dateField: 'createdAt' })
    },
    reminderActivity: buildCategorySeries(reminders, 'status'),
    notificationTrend: buildCategorySeries(notifications, 'status'),
    contextScoreHistory: buildTrendSeries(contexts, { dateField: 'createdAt', valueField: 'contextScore' })
  });
};

const getDashboard = async (userId, query = {}) => {
  const cacheKey = getCacheKey(userId, query);
  const cached = readCache(cacheKey);

  if (cached) {
    return cached;
  }

  const summary = await buildDashboardSummary(userId, query);
  const locationAnalytics = await getLocationAnalytics(userId, query);
  const report = reportService.buildAnalyticsReport({
    range: normalizeFilters(query),
    dashboard: summary.dashboard,
    reminders: await getReminderAnalytics(userId, query),
    notifications: summary.notificationAnalytics,
    context: summary.contextAnalytics,
    behavior: summary.behaviorAnalytics,
    location: locationAnalytics,
    charts: await buildCharts(userId, query)
  });

  const result = {
    ...summary,
    report
  };

  cacheDashboard(cacheKey, result);
  return result;
};

const getAnalyticsReport = async (userId, query = {}) => {
  return getDashboard(userId, query);
};

module.exports = {
  getDashboard,
  getReminderAnalytics,
  getNotificationAnalytics,
  getContextAnalytics,
  getBehaviorAnalytics,
  getLocationAnalytics,
  buildCharts,
  getAnalyticsReport
};
