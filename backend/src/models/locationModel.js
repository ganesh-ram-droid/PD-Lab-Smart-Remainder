const { v4: uuidv4 } = require('uuid');

const { admin, firestore } = require('../config/firebase');

const USER_LOCATIONS_COLLECTION = 'userLocations';
const GEOFENCE_LOGS_COLLECTION = 'geofenceLogs';

const userLocationsCollection = firestore.collection(USER_LOCATIONS_COLLECTION);
const geofenceLogsCollection = firestore.collection(GEOFENCE_LOGS_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeLocation = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    locationId: data.locationId,
    userId: data.userId,
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy,
    speed: data.speed,
    heading: data.heading,
    altitude: data.altitude,
    provider: data.provider,
    timestamp: serializeTimestamp(data.timestamp),
    createdAt: serializeTimestamp(data.createdAt)
  };
};

const serializeGeofenceLog = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    logId: data.logId,
    userId: data.userId,
    reminderId: data.reminderId,
    latitude: data.latitude,
    longitude: data.longitude,
    radius: data.radius,
    distance: data.distance,
    status: data.status,
    enteredAt: serializeTimestamp(data.enteredAt),
    exitedAt: serializeTimestamp(data.exitedAt),
    createdAt: serializeTimestamp(data.createdAt),
    evaluationKey: data.evaluationKey
  };
};

const saveLocation = async (payload) => {
  const locationId = payload.locationId || uuidv4();
  const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();

  const record = {
    locationId,
    userId: payload.userId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    accuracy: payload.accuracy,
    speed: payload.speed,
    heading: payload.heading,
    altitude: payload.altitude,
    provider: payload.provider,
    timestamp: admin.firestore.Timestamp.fromDate(timestamp),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await userLocationsCollection.doc(locationId).set(record);
  return getLocationById(locationId);
};

const getLocationById = async (locationId) => {
  const doc = await userLocationsCollection.doc(locationId).get();
  return serializeLocation(doc);
};

const getLastKnownLocation = async (userId) => {
  const snapshot = await userLocationsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeLocation(snapshot.docs[0]);
};

const getLocationHistory = async (userId, limit = 50) => {
  const snapshot = await userLocationsCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeLocation).filter(Boolean);
};

const deleteLocationHistory = async (userId) => {
  const snapshot = await userLocationsCollection.where('userId', '==', userId).get();
  const batch = firestore.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  return {
    deletedCount: snapshot.size
  };
};

const createGeofenceLog = async (payload) => {
  const logId = payload.logId || uuidv4();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const record = {
    logId,
    userId: payload.userId,
    reminderId: payload.reminderId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    radius: payload.radius,
    distance: payload.distance,
    status: payload.status,
    enteredAt: payload.enteredAt || null,
    exitedAt: payload.exitedAt || null,
    createdAt: now,
    evaluationKey: payload.evaluationKey
  };

  await geofenceLogsCollection.doc(logId).set(record);
  return getGeofenceLogById(logId);
};

const getGeofenceLogById = async (logId) => {
  const doc = await geofenceLogsCollection.doc(logId).get();
  return serializeGeofenceLog(doc);
};

const findGeofenceLogByEvaluationKey = async (evaluationKey) => {
  const snapshot = await geofenceLogsCollection
    .where('evaluationKey', '==', evaluationKey)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeGeofenceLog(snapshot.docs[0]);
};

const getGeofenceLogsByUser = async (userId, limit = 50) => {
  const snapshot = await geofenceLogsCollection
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeGeofenceLog).filter(Boolean);
};

module.exports = {
  saveLocation,
  getLocationById,
  getLastKnownLocation,
  getLocationHistory,
  deleteLocationHistory,
  createGeofenceLog,
  getGeofenceLogById,
  findGeofenceLogByEvaluationKey,
  getGeofenceLogsByUser
};
