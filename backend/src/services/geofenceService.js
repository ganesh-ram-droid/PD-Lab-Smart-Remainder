const { admin } = require('../config/firebase');
const locationModel = require('../models/locationModel');
const reminderModel = require('../models/reminderModel');
const distanceService = require('./distanceService');
const AppError = require('../utils/AppError');
const {
  GEOFENCE_STATUS,
  validateLatitude,
  validateLongitude,
  validateRadius,
  buildGeofenceEvaluationKey
} = require('../utils/geoUtils');

const assertReminderAccess = (reminder, userId) => {
  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.userId !== userId) {
    throw new AppError('You are not authorized to access this geofence.', 403);
  }
};

const assertReminderCanBeEvaluated = (reminder) => {
  if (reminder.isActive === false) {
    throw new AppError('Inactive reminders cannot be evaluated for geofencing.', 409);
  }

  if (reminder.status === 'Completed') {
    throw new AppError('Completed reminders cannot be evaluated for geofencing.', 409);
  }

  if (reminder.status === 'Cancelled') {
    throw new AppError('Cancelled reminders cannot be evaluated for geofencing.', 409);
  }
};

const normalizeGeofencePayload = (payload) => ({
  latitude: validateLatitude(payload.latitude),
  longitude: validateLongitude(payload.longitude),
  radius: validateRadius(payload.radius)
});

const getOwnedReminder = async (userId, reminderId) => {
  const reminder = await reminderModel.getReminderById(reminderId);
  assertReminderAccess(reminder, userId);
  return reminder;
};

const createGeofence = async (userId, payload) => {
  const reminder = await getOwnedReminder(userId, payload.reminderId);

  if (reminder.status === 'Completed') {
    throw new AppError('Completed reminders cannot be converted into geofences.', 409);
  }

  const geofence = normalizeGeofencePayload(payload);

  return reminderModel.updateReminder(payload.reminderId, {
    ...geofence,
    reminderType: 'Location',
    isActive: true,
    contextEnabled: true
  });
};

const updateGeofence = async (userId, reminderId, payload) => {
  const reminder = await getOwnedReminder(userId, reminderId);

  if (reminder.status === 'Completed') {
    throw new AppError('Completed reminder geofences cannot be updated.', 409);
  }

  const updates = {};

  if (payload.latitude !== undefined) {
    updates.latitude = validateLatitude(payload.latitude);
  }

  if (payload.longitude !== undefined) {
    updates.longitude = validateLongitude(payload.longitude);
  }

  if (payload.radius !== undefined) {
    updates.radius = validateRadius(payload.radius);
  }

  if (!Object.keys(updates).length) {
    throw new AppError('At least one geofence field is required for update.', 422);
  }

  return reminderModel.updateReminder(reminderId, updates);
};

const deleteGeofence = async (userId, reminderId) => {
  await getOwnedReminder(userId, reminderId);

  return reminderModel.updateReminder(reminderId, {
    latitude: null,
    longitude: null,
    radius: null,
    reminderType: 'Manual'
  });
};

const enableGeofence = async (userId, reminderId) => {
  await getOwnedReminder(userId, reminderId);

  return reminderModel.updateReminder(reminderId, {
    isActive: true,
    reminderType: 'Location'
  });
};

const disableGeofence = async (userId, reminderId) => {
  await getOwnedReminder(userId, reminderId);

  return reminderModel.updateReminder(reminderId, {
    isActive: false
  });
};

const getGeofence = async (userId, reminderId) => {
  const reminder = await getOwnedReminder(userId, reminderId);

  return {
    reminderId: reminder.reminderId,
    userId: reminder.userId,
    latitude: reminder.latitude,
    longitude: reminder.longitude,
    radius: reminder.radius,
    reminderType: reminder.reminderType,
    isActive: reminder.isActive,
    status: reminder.status
  };
};

const createGeofenceLogIfNeeded = async ({
  userId,
  reminderId,
  latitude,
  longitude,
  radius,
  distance,
  status
}) => {
  const evaluationKey = buildGeofenceEvaluationKey({
    userId,
    reminderId,
    latitude,
    longitude,
    status
  });

  const duplicate = await locationModel.findGeofenceLogByEvaluationKey(evaluationKey);

  if (duplicate) {
    return {
      ...duplicate,
      duplicate: true
    };
  }

  const logPayload = {
    userId,
    reminderId,
    latitude,
    longitude,
    radius,
    distance,
    status,
    enteredAt:
      status === GEOFENCE_STATUS.INSIDE ? admin.firestore.FieldValue.serverTimestamp() : null,
    exitedAt:
      status === GEOFENCE_STATUS.OUTSIDE ? admin.firestore.FieldValue.serverTimestamp() : null,
    evaluationKey
  };

  const log = await locationModel.createGeofenceLog(logPayload);

  return {
    ...log,
    duplicate: false
  };
};

const checkGeofence = async (userId, payload) => {
  const reminder = await getOwnedReminder(userId, payload.reminderId);
  assertReminderCanBeEvaluated(reminder);

  if (
    reminder.latitude === null ||
    reminder.latitude === undefined ||
    reminder.longitude === null ||
    reminder.longitude === undefined ||
    !reminder.radius
  ) {
    throw new AppError('Reminder does not have an active geofence.', 409);
  }

  const latitude = validateLatitude(payload.latitude);
  const longitude = validateLongitude(payload.longitude);

  const decision = distanceService.calculateDistanceWithStatus({
    fromLatitude: latitude,
    fromLongitude: longitude,
    toLatitude: reminder.latitude,
    toLongitude: reminder.longitude,
    radius: reminder.radius
  });

  const log = await createGeofenceLogIfNeeded({
    userId,
    reminderId: reminder.reminderId,
    latitude,
    longitude,
    radius: reminder.radius,
    distance: decision.distanceInMeters,
    status: decision.status
  });

  return {
    reminderId: reminder.reminderId,
    status: decision.status,
    distanceInMeters: decision.distanceInMeters,
    distanceInKilometers: decision.distanceInKilometers,
    radius: reminder.radius,
    insideGeofence: decision.status === GEOFENCE_STATUS.INSIDE,
    log
  };
};

const checkGeofenceEntry = async (userId, payload) => {
  const result = await checkGeofence(userId, payload);

  return {
    ...result,
    entered: result.status === GEOFENCE_STATUS.INSIDE
  };
};

const checkGeofenceExit = async (userId, payload) => {
  const result = await checkGeofence(userId, payload);

  return {
    ...result,
    exited: result.status === GEOFENCE_STATUS.OUTSIDE
  };
};

const calculateDistance = async (payload) => {
  const fromLatitude = validateLatitude(payload.fromLatitude);
  const fromLongitude = validateLongitude(payload.fromLongitude);
  const toLatitude = validateLatitude(payload.toLatitude);
  const toLongitude = validateLongitude(payload.toLongitude);

  return distanceService.calculateDistance({
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude
  });
};

module.exports = {
  createGeofence,
  updateGeofence,
  deleteGeofence,
  enableGeofence,
  disableGeofence,
  getGeofence,
  checkGeofence,
  checkGeofenceEntry,
  checkGeofenceExit,
  calculateDistance
};
