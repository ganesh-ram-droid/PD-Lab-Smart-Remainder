const { v4: uuidv4 } = require('uuid');

const reminderModel = require('../models/reminderModel');
const contextModel = require('../models/contextModel');
const contextScoreService = require('./contextScoreService');
const contextHistoryService = require('./contextHistoryService');
const {
  ACTIVITY_TYPES,
  DEVICE_STATES,
  NETWORK_STATUSES,
  normalizeBatteryLevel,
  normalizeDeviceState,
  normalizeNetworkStatus,
  roundCoordinate
} = require('../utils/contextWeights');
const AppError = require('../utils/AppError');

const normalizeDayOfWeek = (value, fallbackDate) => {
  if (value) {
    return value;
  }

  const date = fallbackDate ? new Date(fallbackDate) : new Date();
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const buildEvaluationKey = (userId, reminderId, context) => {
  const parts = [
    userId,
    reminderId,
    roundCoordinate(context.currentLatitude),
    roundCoordinate(context.currentLongitude),
    context.currentActivity,
    context.dayOfWeek,
    normalizeBatteryLevel(context.batteryLevel) ?? 'na',
    normalizeNetworkStatus(context.networkStatus),
    normalizeDeviceState(context.deviceState),
    new Date(context.currentTime || Date.now()).toISOString().slice(0, 16)
  ];

  return parts.join('|');
};

const assertReminderEligible = (reminder) => {
  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.isActive === false) {
    throw new AppError('Inactive reminders cannot be evaluated.', 409);
  }

  if (reminder.status === 'Completed') {
    throw new AppError('Completed reminders cannot be evaluated.', 409);
  }

  if (reminder.status === 'Cancelled') {
    throw new AppError('Deleted or cancelled reminders cannot be evaluated.', 409);
  }

  if (reminder.status === 'Missed') {
    throw new AppError('Missed reminders cannot be evaluated again.', 409);
  }
};

const normalizeContextInput = (payload) => {
  const currentTime = payload.currentTime ? new Date(payload.currentTime).toISOString() : new Date().toISOString();

  return {
    reminderId: payload.reminderId,
    userId: payload.userId,
    currentLatitude:
      payload.currentLatitude === undefined || payload.currentLatitude === null
        ? null
        : Number(payload.currentLatitude),
    currentLongitude:
      payload.currentLongitude === undefined || payload.currentLongitude === null
        ? null
        : Number(payload.currentLongitude),
    currentActivity: payload.currentActivity || 'Unknown',
    currentTime,
    dayOfWeek: normalizeDayOfWeek(payload.dayOfWeek, currentTime),
    batteryLevel: normalizeBatteryLevel(payload.batteryLevel),
    networkStatus: normalizeNetworkStatus(payload.networkStatus),
    deviceState: normalizeDeviceState(payload.deviceState),
    weather: payload.weather || '',
    latitudeProvided: payload.currentLatitude !== undefined && payload.currentLatitude !== null,
    longitudeProvided: payload.currentLongitude !== undefined && payload.currentLongitude !== null
  };
};

const validateContextCoordinates = (context) => {
  if (context.currentLatitude === null || Number.isNaN(context.currentLatitude)) {
    throw new AppError('Latitude must be a valid number.', 422);
  }

  if (context.currentLongitude === null || Number.isNaN(context.currentLongitude)) {
    throw new AppError('Longitude must be a valid number.', 422);
  }

  if (context.currentLatitude < -90 || context.currentLatitude > 90) {
    throw new AppError('Latitude must be between -90 and 90.', 422);
  }

  if (context.currentLongitude < -180 || context.currentLongitude > 180) {
    throw new AppError('Longitude must be between -180 and 180.', 422);
  }
};

const validateActivity = (activity) => {
  if (!ACTIVITY_TYPES.includes(activity)) {
    throw new AppError('Invalid activity type.', 422);
  }
};

const validateContextPayload = (payload) => {
  const normalized = normalizeContextInput(payload);

  validateContextCoordinates(normalized);
  validateActivity(normalized.currentActivity);

  if (normalized.userId && normalized.userId !== payload.authenticatedUserId) {
    throw new AppError('UserId must match the authenticated user.', 403);
  }

  return normalized;
};

const buildEvaluation = async (userId, payload) => {
  const normalized = validateContextPayload({
    ...payload,
    userId,
    authenticatedUserId: userId
  });

  const reminder = await reminderModel.getReminderById(normalized.reminderId);

  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.userId !== userId) {
    throw new AppError('You are not authorized to evaluate this reminder.', 403);
  }

  assertReminderEligible(reminder);

  const history = await contextHistoryService.buildHistoryInsights({
    userId,
    reminderId: normalized.reminderId,
    reminder
  });

  const scoring = contextScoreService.calculateContextScore({
    reminder,
    context: normalized,
    historyScore: history.historyScore
  });

  const evaluationKey = buildEvaluationKey(userId, normalized.reminderId, normalized);
  const contextId = uuidv4();

  return {
    contextId,
    evaluationKey,
    userId,
    reminderId: normalized.reminderId,
    currentLatitude: normalized.currentLatitude,
    currentLongitude: normalized.currentLongitude,
    distance: scoring.distance,
    currentActivity: scoring.currentActivity,
    currentTime: scoring.currentTime,
    dayOfWeek: scoring.dayOfWeek,
    batteryLevel: normalized.batteryLevel,
    networkStatus: normalized.networkStatus,
    deviceState: normalized.deviceState,
    weather: normalized.weather,
    locationMatched: scoring.locationMatched,
    timeMatched: scoring.timeMatched,
    activityMatched: scoring.activityMatched,
    priorityScore: scoring.priorityScore,
    historyScore: scoring.historyScore,
    contextScore: scoring.contextScore,
    decision: scoring.decision,
    reason: scoring.reason,
    reminderSnapshot: reminder,
    historyReasons: history.historyReasons,
    scoreBreakdown: {
      location: scoring.locationScore,
      time: scoring.timeScore,
      activity: scoring.activityScore,
      history: scoring.historyScore,
      priority: scoring.priorityScore,
      battery: scoring.batteryScore,
      network: scoring.networkScore
    }
  };
};

const evaluateContext = async (userId, payload, { persist = true } = {}) => {
  const evaluation = await buildEvaluation(userId, payload);

  if (!persist) {
    return evaluation;
  }

  const duplicate = await contextModel.findContextByEvaluationKey(evaluation.evaluationKey);

  if (duplicate) {
    return {
      ...duplicate,
      duplicate: true,
      scoreBreakdown: evaluation.scoreBreakdown,
      historyReasons: evaluation.historyReasons
    };
  }

  const saved = await contextModel.createContextLog({
    contextId: evaluation.contextId,
    evaluationKey: evaluation.evaluationKey,
    userId: evaluation.userId,
    reminderId: evaluation.reminderId,
    currentLatitude: evaluation.currentLatitude,
    currentLongitude: evaluation.currentLongitude,
    distance: evaluation.distance,
    currentActivity: evaluation.currentActivity,
    currentTime: evaluation.currentTime,
    dayOfWeek: evaluation.dayOfWeek,
    batteryLevel: evaluation.batteryLevel,
    networkStatus: evaluation.networkStatus,
    deviceState: evaluation.deviceState,
    weather: evaluation.weather,
    locationMatched: evaluation.locationMatched,
    timeMatched: evaluation.timeMatched,
    activityMatched: evaluation.activityMatched,
    priorityScore: evaluation.priorityScore,
    historyScore: evaluation.historyScore,
    contextScore: evaluation.contextScore,
    decision: evaluation.decision,
    reason: evaluation.reason
  });

  return {
    ...saved,
    duplicate: false,
    scoreBreakdown: evaluation.scoreBreakdown,
    historyReasons: evaluation.historyReasons
  };
};

const storeContextLog = async (userId, payload) => {
  if (payload.contextScore !== undefined && payload.decision) {
    const normalized = validateContextPayload({
      ...payload,
      userId,
      authenticatedUserId: userId
    });

    const evaluationKey =
      payload.evaluationKey || buildEvaluationKey(userId, normalized.reminderId, normalized);

    const duplicate = await contextModel.findContextByEvaluationKey(evaluationKey);

    if (duplicate) {
      return {
        ...duplicate,
        duplicate: true
      };
    }

    return contextModel.createContextLog({
      contextId: payload.contextId || uuidv4(),
      evaluationKey,
      userId,
      reminderId: normalized.reminderId,
      currentLatitude: normalized.currentLatitude,
      currentLongitude: normalized.currentLongitude,
      distance: payload.distance ?? null,
      currentActivity: normalized.currentActivity,
      currentTime: normalized.currentTime,
      dayOfWeek: normalized.dayOfWeek,
      batteryLevel: normalized.batteryLevel,
      networkStatus: normalized.networkStatus,
      deviceState: normalized.deviceState,
      weather: normalized.weather,
      locationMatched: Boolean(payload.locationMatched),
      timeMatched: Boolean(payload.timeMatched),
      activityMatched: Boolean(payload.activityMatched),
      priorityScore: Number(payload.priorityScore) || 0,
      historyScore: Number(payload.historyScore) || 0,
      contextScore: Number(payload.contextScore),
      decision: payload.decision,
      reason: payload.reason || ''
    });
  }

  return evaluateContext(userId, payload, { persist: true });
};

const getContextHistory = async (userId, query = {}) => {
  const reminderId = query.reminderId || null;
  const limit = query.limit ? Number(query.limit) : 25;

  return contextHistoryService.getContextHistory(userId, reminderId, limit);
};

const calculateCurrentScore = async (userId, reminderId, payload) => {
  return evaluateContext(
    userId,
    {
      ...payload,
      reminderId
    },
    { persist: false }
  );
};

module.exports = {
  evaluateContext,
  storeContextLog,
  getContextHistory,
  calculateCurrentScore
};
