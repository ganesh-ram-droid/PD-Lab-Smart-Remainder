const { admin, firestore } = require('../config/firebase');

const ANALYTICS_COLLECTION = 'analytics';

const analyticsCollection = firestore.collection(ANALYTICS_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeAnalytics = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    analyticsId: data.analyticsId,
    userId: data.userId,
    date: data.date,
    totalReminders: data.totalReminders,
    completedReminders: data.completedReminders,
    missedReminders: data.missedReminders,
    ignoredReminders: data.ignoredReminders,
    dismissedReminders: data.dismissedReminders,
    snoozedReminders: data.snoozedReminders,
    notificationsSent: data.notificationsSent,
    notificationsOpened: data.notificationsOpened,
    notificationsSuppressed: data.notificationsSuppressed,
    averageContextScore: data.averageContextScore,
    averageResponseTime: data.averageResponseTime,
    mostUsedCategory: data.mostUsedCategory,
    mostVisitedLocation: data.mostVisitedLocation,
    preferredReminderTime: data.preferredReminderTime,
    completionRate: data.completionRate,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
};

const upsertDailyAnalytics = async (analyticsId, payload) => {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const record = {
    analyticsId,
    ...payload,
    createdAt: payload.createdAt || now,
    updatedAt: now
  };

  await analyticsCollection.doc(analyticsId).set(record, { merge: true });
  return getAnalyticsById(analyticsId);
};

const getAnalyticsById = async (analyticsId) => {
  const doc = await analyticsCollection.doc(analyticsId).get();
  return serializeAnalytics(doc);
};

const getAnalyticsByUserAndDate = async (userId, date) => {
  const snapshot = await analyticsCollection
    .where('userId', '==', userId)
    .where('date', '==', date)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeAnalytics(snapshot.docs[0]);
};

const getAnalyticsHistory = async (userId, { limit = 30 } = {}) => {
  const snapshot = await analyticsCollection
    .where('userId', '==', userId)
    .orderBy('date', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeAnalytics).filter(Boolean);
};

module.exports = {
  upsertDailyAnalytics,
  getAnalyticsById,
  getAnalyticsByUserAndDate,
  getAnalyticsHistory
};
