const { v4: uuidv4 } = require('uuid');

const { admin, firestore } = require('../config/firebase');

const BEHAVIOR_LOGS_COLLECTION = 'behaviorLogs';
const LEARNING_PROFILES_COLLECTION = 'learningProfiles';

const behaviorLogsCollection = firestore.collection(BEHAVIOR_LOGS_COLLECTION);
const learningProfilesCollection = firestore.collection(LEARNING_PROFILES_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeBehaviorLog = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    behaviorId: data.behaviorId,
    userId: data.userId,
    reminderId: data.reminderId,
    action: data.action,
    contextScore: data.contextScore,
    responseTime: data.responseTime,
    activity: data.activity,
    latitude: data.latitude,
    longitude: data.longitude,
    batteryLevel: data.batteryLevel,
    networkStatus: data.networkStatus,
    timestamp: serializeTimestamp(data.timestamp),
    behaviorKey: data.behaviorKey
  };
};

const serializeLearningProfile = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    userId: data.userId,
    completionRate: data.completionRate,
    ignoreRate: data.ignoreRate,
    dismissRate: data.dismissRate,
    snoozeRate: data.snoozeRate,
    averageResponseTime: data.averageResponseTime,
    preferredReminderTime: data.preferredReminderTime,
    preferredReminderDay: data.preferredReminderDay,
    preferredActivity: data.preferredActivity,
    preferredLocation: data.preferredLocation,
    mostSuccessfulReminderCategory: data.mostSuccessfulReminderCategory,
    adaptiveWeight: data.adaptiveWeight,
    confidenceScore: data.confidenceScore,
    totalBehaviorCount: data.totalBehaviorCount,
    patterns: data.patterns,
    lastUpdated: serializeTimestamp(data.lastUpdated)
  };
};

const createBehaviorLog = async (payload) => {
  const behaviorId = payload.behaviorId || uuidv4();
  const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();

  const record = {
    behaviorId,
    userId: payload.userId,
    reminderId: payload.reminderId,
    action: payload.action,
    contextScore: payload.contextScore,
    responseTime: payload.responseTime,
    activity: payload.activity,
    latitude: payload.latitude,
    longitude: payload.longitude,
    batteryLevel: payload.batteryLevel,
    networkStatus: payload.networkStatus,
    timestamp: admin.firestore.Timestamp.fromDate(timestamp),
    behaviorKey: payload.behaviorKey
  };

  await behaviorLogsCollection.doc(behaviorId).set(record);
  return getBehaviorLogById(behaviorId);
};

const getBehaviorLogById = async (behaviorId) => {
  const doc = await behaviorLogsCollection.doc(behaviorId).get();
  return serializeBehaviorLog(doc);
};

const findBehaviorLogByKey = async (behaviorKey) => {
  const snapshot = await behaviorLogsCollection
    .where('behaviorKey', '==', behaviorKey)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeBehaviorLog(snapshot.docs[0]);
};

const getBehaviorLogsByUser = async (userId, { reminderId = null, limit = 50, startAfter = null } = {}) => {
  let query = behaviorLogsCollection.where('userId', '==', userId);

  if (reminderId) {
    query = query.where('reminderId', '==', reminderId);
  }

  query = query.orderBy('timestamp', 'desc');

  if (startAfter) {
    const cursorDoc = await behaviorLogsCollection.doc(startAfter).get();

    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.limit(limit).get();

  return {
    items: snapshot.docs.map(serializeBehaviorLog).filter(Boolean),
    nextCursor: snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1].id : null
  };
};

const getAllBehaviorLogsByUser = async (userId, limit = 500) => {
  const snapshot = await behaviorLogsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeBehaviorLog).filter(Boolean);
};

const getLearningProfile = async (userId) => {
  const doc = await learningProfilesCollection.doc(userId).get();
  return serializeLearningProfile(doc);
};

const upsertLearningProfile = async (userId, profile) => {
  const record = {
    ...profile,
    userId,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  };

  await learningProfilesCollection.doc(userId).set(record, { merge: true });
  return getLearningProfile(userId);
};

module.exports = {
  createBehaviorLog,
  getBehaviorLogById,
  findBehaviorLogByKey,
  getBehaviorLogsByUser,
  getAllBehaviorLogsByUser,
  getLearningProfile,
  upsertLearningProfile
};
