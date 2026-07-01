const { v4: uuidv4 } = require('uuid');

const { admin, firestore } = require('../config/firebase');

const CONTEXT_COLLECTION = 'contextLogs';

const contextCollection = firestore.collection(CONTEXT_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeContextLog = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    contextId: data.contextId,
    userId: data.userId,
    reminderId: data.reminderId,
    currentLatitude: data.currentLatitude,
    currentLongitude: data.currentLongitude,
    distance: data.distance,
    currentActivity: data.currentActivity,
    currentTime: data.currentTime,
    dayOfWeek: data.dayOfWeek,
    batteryLevel: data.batteryLevel,
    networkStatus: data.networkStatus,
    deviceState: data.deviceState,
    weather: data.weather,
    locationMatched: data.locationMatched,
    timeMatched: data.timeMatched,
    activityMatched: data.activityMatched,
    priorityScore: data.priorityScore,
    historyScore: data.historyScore,
    contextScore: data.contextScore,
    decision: data.decision,
    reason: data.reason,
    evaluationKey: data.evaluationKey,
    createdAt: serializeTimestamp(data.createdAt)
  };
};

const createContextLog = async (payload) => {
  const contextId = payload.contextId || uuidv4();
  const docRef = contextCollection.doc(contextId);

  const record = {
    ...payload,
    contextId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(record);
  return getContextLogById(contextId);
};

const getContextLogById = async (contextId) => {
  const doc = await contextCollection.doc(contextId).get();
  return serializeContextLog(doc);
};

const findContextByEvaluationKey = async (evaluationKey) => {
  const snapshot = await contextCollection
    .where('evaluationKey', '==', evaluationKey)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeContextLog(snapshot.docs[0]);
};

const getContextLogsByUser = async (userId, { reminderId = null, limit = 25 } = {}) => {
  let query = contextCollection.where('userId', '==', userId);

  if (reminderId) {
    query = query.where('reminderId', '==', reminderId);
  }

  const snapshot = await query.orderBy('createdAt', 'desc').limit(limit).get();
  return snapshot.docs.map(serializeContextLog).filter(Boolean);
};

const getContextLogsByReminder = async (userId, reminderId, limit = 20) => {
  const snapshot = await contextCollection
    .where('userId', '==', userId)
    .where('reminderId', '==', reminderId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeContextLog).filter(Boolean);
};

module.exports = {
  createContextLog,
  getContextLogById,
  findContextByEvaluationKey,
  getContextLogsByUser,
  getContextLogsByReminder
};
