const behaviorModel = require('../models/behaviorModel');
const reminderModel = require('../models/reminderModel');
const patternAnalysisService = require('./patternAnalysisService');
const learningEngine = require('./learningEngine');
const AppError = require('../utils/AppError');
const {
  USER_ACTIONS,
  buildBehaviorDedupKey
} = require('../utils/learningWeights');

const normalizeOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const assertReminderAccess = async (userId, reminderId) => {
  const reminder = await reminderModel.getReminderById(reminderId);

  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.userId !== userId) {
    throw new AppError('You are not authorized to log behavior for this reminder.', 403);
  }

  return reminder;
};

const normalizeBehaviorPayload = (userId, payload) => {
  if (!USER_ACTIONS.includes(payload.action)) {
    throw new AppError('Invalid behavior action.', 422);
  }

  const timestamp = payload.timestamp || new Date().toISOString();

  return {
    userId,
    reminderId: payload.reminderId,
    action: payload.action,
    contextScore: normalizeOptionalNumber(payload.contextScore),
    responseTime: normalizeOptionalNumber(payload.responseTime),
    activity: payload.activity || 'Unknown',
    latitude: normalizeOptionalNumber(payload.latitude),
    longitude: normalizeOptionalNumber(payload.longitude),
    batteryLevel: normalizeOptionalNumber(payload.batteryLevel),
    networkStatus: payload.networkStatus || 'Offline',
    timestamp,
    behaviorKey:
      payload.behaviorKey ||
      buildBehaviorDedupKey({
        userId,
        reminderId: payload.reminderId,
        action: payload.action,
        timestamp
      })
  };
};

const rebuildLearningProfile = async (userId) => {
  const logs = await behaviorModel.getAllBehaviorLogsByUser(userId, 500);
  const patterns = await patternAnalysisService.analyzeBehaviorPatterns(logs);
  const profile = learningEngine.buildLearningProfile({ logs, patterns });

  return behaviorModel.upsertLearningProfile(userId, profile);
};

const logBehavior = async (userId, payload) => {
  await assertReminderAccess(userId, payload.reminderId);

  const normalized = normalizeBehaviorPayload(userId, payload);
  const duplicate = await behaviorModel.findBehaviorLogByKey(normalized.behaviorKey);

  if (duplicate) {
    const profile = await behaviorModel.getLearningProfile(userId);

    return {
      behavior: duplicate,
      profile,
      duplicate: true
    };
  }

  const behavior = await behaviorModel.createBehaviorLog(normalized);
  const profile = await rebuildLearningProfile(userId);

  return {
    behavior,
    profile,
    duplicate: false
  };
};

const getBehaviorHistory = async (userId, query = {}) => {
  const limit = query.limit ? Number(query.limit) : 50;
  const reminderId = query.reminderId || null;
  const startAfter = query.cursor || null;

  return behaviorModel.getBehaviorLogsByUser(userId, {
    reminderId,
    limit,
    startAfter
  });
};

const getLearningProfile = async (userId) => {
  const existingProfile = await behaviorModel.getLearningProfile(userId);

  if (existingProfile) {
    return existingProfile;
  }

  return rebuildLearningProfile(userId);
};

const analyzeUserBehavior = async (userId, payload = {}) => {
  const logs = await behaviorModel.getAllBehaviorLogsByUser(
    userId,
    payload.limit ? Number(payload.limit) : 500
  );
  const patterns = await patternAnalysisService.analyzeBehaviorPatterns(logs);
  const profile = learningEngine.buildLearningProfile({ logs, patterns });
  const savedProfile = await behaviorModel.upsertLearningProfile(userId, profile);

  const adaptiveContext = learningEngine.adjustContextScore({
    baseContextScore: payload.contextScore || 0,
    profile: savedProfile,
    activity: payload.activity,
    timestamp: payload.timestamp,
    latitude: payload.latitude,
    longitude: payload.longitude
  });

  return {
    profile: savedProfile,
    adaptiveContext,
    analytics: {
      completionRate: savedProfile.completionRate,
      ignoreRate: savedProfile.ignoreRate,
      dismissRate: savedProfile.dismissRate,
      averageResponseTime: savedProfile.averageResponseTime,
      preferredReminderTime: savedProfile.preferredReminderTime,
      preferredReminderDay: savedProfile.preferredReminderDay,
      mostSuccessfulReminderCategory: savedProfile.mostSuccessfulReminderCategory
    }
  };
};

const predictBestReminderContext = async (userId) => {
  const profile = await getLearningProfile(userId);
  return learningEngine.predictBestContext(profile);
};

module.exports = {
  logBehavior,
  getBehaviorHistory,
  getLearningProfile,
  analyzeUserBehavior,
  predictBestReminderContext,
  rebuildLearningProfile
};
