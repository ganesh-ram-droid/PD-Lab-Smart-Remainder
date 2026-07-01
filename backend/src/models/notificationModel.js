const { v4: uuidv4 } = require('uuid');

const { admin, firestore } = require('../config/firebase');

const NOTIFICATIONS_COLLECTION = 'notifications';
const NOTIFICATION_LOGS_COLLECTION = 'notificationLogs';
const DEVICE_TOKENS_COLLECTION = 'deviceTokens';

const notificationsCollection = firestore.collection(NOTIFICATIONS_COLLECTION);
const notificationLogsCollection = firestore.collection(NOTIFICATION_LOGS_COLLECTION);
const deviceTokensCollection = firestore.collection(DEVICE_TOKENS_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const toTimestampOrNull = (value) => {
  if (!value) {
    return null;
  }

  return admin.firestore.Timestamp.fromDate(new Date(value));
};

const serializeNotification = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    notificationId: data.notificationId,
    userId: data.userId,
    reminderId: data.reminderId,
    title: data.title,
    body: data.body,
    type: data.type,
    priority: data.priority,
    status: data.status,
    scheduledTime: serializeTimestamp(data.scheduledTime),
    sentTime: serializeTimestamp(data.sentTime),
    deliveredTime: serializeTimestamp(data.deliveredTime),
    openedTime: serializeTimestamp(data.openedTime),
    contextScore: data.contextScore,
    decisionReason: data.decisionReason,
    deviceToken: data.deviceToken,
    messageId: data.messageId,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
};

const serializeNotificationLog = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    logId: data.logId,
    notificationId: data.notificationId,
    action: data.action,
    status: data.status,
    response: data.response,
    timestamp: serializeTimestamp(data.timestamp)
  };
};

const serializeDeviceToken = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    tokenId: data.tokenId,
    userId: data.userId,
    deviceId: data.deviceId,
    deviceToken: data.deviceToken,
    platform: data.platform,
    isActive: data.isActive,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
};

const upsertDeviceToken = async ({ userId, deviceId, deviceToken, platform }) => {
  const tokenId = `${userId}_${deviceId}`;
  const now = admin.firestore.FieldValue.serverTimestamp();

  await deviceTokensCollection.doc(tokenId).set(
    {
      tokenId,
      userId,
      deviceId,
      deviceToken,
      platform,
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
    { merge: true }
  );

  return getDeviceTokenById(tokenId);
};

const getDeviceTokenById = async (tokenId) => {
  const doc = await deviceTokensCollection.doc(tokenId).get();
  return serializeDeviceToken(doc);
};

const getActiveDeviceTokensByUser = async (userId) => {
  const snapshot = await deviceTokensCollection
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .get();

  return snapshot.docs.map(serializeDeviceToken).filter(Boolean);
};

const deactivateDeviceToken = async ({ userId, deviceId }) => {
  const tokenId = `${userId}_${deviceId}`;

  await deviceTokensCollection.doc(tokenId).set(
    {
      isActive: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return getDeviceTokenById(tokenId);
};

const createNotification = async (payload) => {
  const notificationId = payload.notificationId || uuidv4();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const record = {
    notificationId,
    userId: payload.userId,
    reminderId: payload.reminderId,
    title: payload.title,
    body: payload.body,
    type: payload.type,
    priority: payload.priority,
    status: payload.status,
    scheduledTime: toTimestampOrNull(payload.scheduledTime),
    sentTime: toTimestampOrNull(payload.sentTime),
    deliveredTime: toTimestampOrNull(payload.deliveredTime),
    openedTime: toTimestampOrNull(payload.openedTime),
    contextScore: payload.contextScore,
    decisionReason: payload.decisionReason,
    deviceToken: payload.deviceToken,
    messageId: payload.messageId || null,
    createdAt: now,
    updatedAt: now
  };

  await notificationsCollection.doc(notificationId).set(record);
  return getNotificationById(notificationId);
};

const getNotificationById = async (notificationId) => {
  const doc = await notificationsCollection.doc(notificationId).get();
  return serializeNotification(doc);
};

const updateNotification = async (notificationId, updates) => {
  const normalizedUpdates = { ...updates };

  ['scheduledTime', 'sentTime', 'deliveredTime', 'openedTime'].forEach((field) => {
    if (normalizedUpdates[field] !== undefined) {
      normalizedUpdates[field] = toTimestampOrNull(normalizedUpdates[field]);
    }
  });

  await notificationsCollection.doc(notificationId).update({
    ...normalizedUpdates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return getNotificationById(notificationId);
};

const getNotificationsByUser = async (userId, { limit = 50, status = null } = {}) => {
  let query = notificationsCollection.where('userId', '==', userId);

  if (status) {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
  return snapshot.docs.map(serializeNotification).filter(Boolean);
};

const getNotificationsByReminder = async (userId, reminderId) => {
  const snapshot = await notificationsCollection
    .where('userId', '==', userId)
    .where('reminderId', '==', reminderId)
    .get();

  return snapshot.docs.map(serializeNotification).filter(Boolean);
};

const createNotificationLog = async ({ notificationId, action, status, response }) => {
  const logId = uuidv4();

  await notificationLogsCollection.doc(logId).set({
    logId,
    notificationId,
    action,
    status,
    response,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  const doc = await notificationLogsCollection.doc(logId).get();
  return serializeNotificationLog(doc);
};

const getNotificationLogs = async (notificationId, limit = 25) => {
  const snapshot = await notificationLogsCollection
    .where('notificationId', '==', notificationId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeNotificationLog).filter(Boolean);
};

module.exports = {
  upsertDeviceToken,
  getActiveDeviceTokensByUser,
  deactivateDeviceToken,
  createNotification,
  getNotificationById,
  updateNotification,
  getNotificationsByUser,
  getNotificationsByReminder,
  createNotificationLog,
  getNotificationLogs
};
