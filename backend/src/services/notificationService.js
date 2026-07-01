const notificationModel = require('../models/notificationModel');
const reminderModel = require('../models/reminderModel');
const contextEvaluationService = require('./contextEvaluationService');
const behaviorService = require('./behaviorService');
const learningEngine = require('./learningEngine');
const fcmService = require('./fcmService');
const schedulerService = require('./schedulerService');
const notificationHistoryService = require('./notificationHistoryService');
const AppError = require('../utils/AppError');
const {
  ACTIVE_NOTIFICATION_STATUSES,
  buildNotificationTemplate
} = require('../utils/notificationTemplates');

const CONTEXT_THRESHOLD = 70;
const HIGH_PRIORITY_OVERRIDE_THRESHOLD = 60;

const assertReminderAccess = async (userId, reminderId) => {
  const reminder = await reminderModel.getReminderById(reminderId);

  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.userId !== userId) {
    throw new AppError('You are not authorized to access this reminder.', 403);
  }

  if (reminder.isActive === false) {
    throw new AppError('Inactive reminders cannot be notified.', 409);
  }

  if (reminder.status === 'Completed') {
    throw new AppError('Completed reminders cannot be notified.', 409);
  }

  if (reminder.status === 'Cancelled') {
    throw new AppError('Cancelled reminders cannot be notified.', 409);
  }

  return reminder;
};

const assertNotificationAccess = async (userId, notificationId) => {
  const notification = await notificationModel.getNotificationById(notificationId);

  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }

  if (notification.userId !== userId) {
    throw new AppError('You are not authorized to access this notification.', 403);
  }

  return notification;
};

const registerDeviceToken = async (userId, payload) => {
  return notificationModel.upsertDeviceToken({
    userId,
    deviceId: payload.deviceId,
    deviceToken: payload.deviceToken,
    platform: payload.platform || 'Unknown'
  });
};

const updateDeviceToken = async (userId, payload) => registerDeviceToken(userId, payload);

const deleteDeviceToken = async (userId, payload) => {
  return notificationModel.deactivateDeviceToken({
    userId,
    deviceId: payload.deviceId
  });
};

const getTargetDeviceTokens = async (userId, explicitDeviceToken = null) => {
  if (explicitDeviceToken) {
    return [explicitDeviceToken];
  }

  const tokens = await notificationModel.getActiveDeviceTokensByUser(userId);

  if (!tokens.length) {
    throw new AppError('No active device token found for this user.', 404);
  }

  return tokens.map((token) => token.deviceToken);
};

const assertNoActiveDuplicate = async (userId, reminderId) => {
  const notifications = await notificationModel.getNotificationsByReminder(userId, reminderId);
  const activeDuplicate = notifications.find((notification) =>
    ACTIVE_NOTIFICATION_STATUSES.includes(notification.status)
  );

  if (activeDuplicate) {
    throw new AppError('Notification already exists for this reminder.', 409, true, {
      notificationId: activeDuplicate.notificationId,
      status: activeDuplicate.status
    });
  }
};

const buildContextPayload = (reminderId, payload) => {
  const context = payload.context || {};

  return {
    ...context,
    reminderId,
    currentLatitude: context.currentLatitude ?? payload.currentLatitude,
    currentLongitude: context.currentLongitude ?? payload.currentLongitude,
    currentActivity: context.currentActivity ?? payload.currentActivity,
    currentTime: context.currentTime ?? payload.currentTime,
    dayOfWeek: context.dayOfWeek ?? payload.dayOfWeek,
    batteryLevel: context.batteryLevel ?? payload.batteryLevel,
    networkStatus: context.networkStatus ?? payload.networkStatus,
    deviceState: context.deviceState ?? payload.deviceState,
    weather: context.weather ?? payload.weather
  };
};

const evaluateNotificationDecision = async ({ userId, reminder, payload }) => {
  const contextEvaluation = await contextEvaluationService.evaluateContext(
    userId,
    buildContextPayload(reminder.reminderId, payload),
    { persist: true }
  );
  const profile = await behaviorService.getLearningProfile(userId);
  const adaptive = learningEngine.adjustContextScore({
    baseContextScore: contextEvaluation.contextScore,
    profile,
    activity: contextEvaluation.currentActivity,
    timestamp: contextEvaluation.currentTime,
    latitude: contextEvaluation.currentLatitude,
    longitude: contextEvaluation.currentLongitude
  });

  const highPriorityOverride =
    reminder.priority === 'High' &&
    adaptive.adjustedContextScore >= HIGH_PRIORITY_OVERRIDE_THRESHOLD;
  const shouldNotify =
    adaptive.adjustedContextScore >= CONTEXT_THRESHOLD || highPriorityOverride;
  const decisionReason = [
    contextEvaluation.reason,
    ...adaptive.reasons,
    highPriorityOverride ? 'High-priority reminder override' : null
  ]
    .filter(Boolean)
    .join(', ');

  return {
    contextEvaluation,
    adaptive,
    shouldNotify,
    decisionReason: decisionReason || 'Context score below notification threshold.'
  };
};

const buildNotificationPayload = ({
  userId,
  reminder,
  payload,
  decision,
  status,
  deviceToken = null,
  messageId = null
}) => {
  const template = buildNotificationTemplate({
    reminder,
    type: payload.type || 'Context Reminder',
    decisionReason: decision.decisionReason
  });

  return {
    userId,
    reminderId: reminder.reminderId,
    title: payload.title || template.title,
    body: payload.body || template.body,
    type: payload.type || template.type,
    priority: payload.priority || template.priority,
    status,
    scheduledTime: payload.scheduledTime || null,
    sentTime: status === 'Sent' ? new Date().toISOString() : null,
    deliveredTime: null,
    openedTime: null,
    contextScore: decision.adaptive.adjustedContextScore,
    decisionReason: decision.decisionReason,
    deviceToken,
    messageId
  };
};

const createSuppressedNotification = async ({ userId, reminder, payload, decision }) => {
  const notification = await notificationModel.createNotification(
    buildNotificationPayload({
      userId,
      reminder,
      payload,
      decision,
      status: 'Suppressed'
    })
  );

  await notificationHistoryService.logNotificationAction({
    notificationId: notification.notificationId,
    action: 'Suppress Notification',
    status: 'Suppressed',
    response: {
      contextScore: decision.adaptive.adjustedContextScore,
      reason: decision.decisionReason
    }
  });

  return {
    notification,
    decision,
    sent: false
  };
};

const sendNotification = async (userId, payload) => {
  const reminder = await assertReminderAccess(userId, payload.reminderId);
  await assertNoActiveDuplicate(userId, reminder.reminderId);

  const decision = await evaluateNotificationDecision({ userId, reminder, payload });

  if (!decision.shouldNotify) {
    return createSuppressedNotification({ userId, reminder, payload, decision });
  }

  const deviceTokens = await getTargetDeviceTokens(userId, payload.deviceToken);
  const template = buildNotificationTemplate({
    reminder,
    type: payload.type || 'Context Reminder',
    decisionReason: decision.decisionReason
  });
  const deliveryResults = await fcmService.sendMulticastNotification({
    deviceTokens,
    title: payload.title || template.title,
    body: payload.body || template.body,
    priority: payload.priority || template.priority,
    data: {
      reminderId: reminder.reminderId,
      type: payload.type || template.type,
      contextScore: decision.adaptive.adjustedContextScore,
      actionButtons: JSON.stringify(template.actionButtons)
    }
  });
  const successfulDelivery = deliveryResults.find((result) => result.success);

  const notification = await notificationModel.createNotification(
    buildNotificationPayload({
      userId,
      reminder,
      payload,
      decision,
      status: successfulDelivery ? 'Sent' : 'Failed',
      deviceToken: payload.deviceToken || 'MULTIPLE_DEVICES',
      messageId: successfulDelivery?.messageId || null
    })
  );

  await notificationHistoryService.logNotificationAction({
    notificationId: notification.notificationId,
    action: 'Send Notification',
    status: notification.status,
    response: deliveryResults
  });

  return {
    notification,
    decision,
    deliveryResults,
    sent: Boolean(successfulDelivery)
  };
};

const scheduleNotification = async (userId, payload) => {
  const reminder = await assertReminderAccess(userId, payload.reminderId);
  await assertNoActiveDuplicate(userId, reminder.reminderId);

  const decision = await evaluateNotificationDecision({ userId, reminder, payload });

  if (!decision.shouldNotify) {
    return createSuppressedNotification({ userId, reminder, payload, decision });
  }

  const deviceTokens = await getTargetDeviceTokens(userId, payload.deviceToken);
  const notification = await schedulerService.scheduleNotification(
    buildNotificationPayload({
      userId,
      reminder,
      payload,
      decision,
      status: 'Scheduled',
      deviceToken: payload.deviceToken || deviceTokens.join(',')
    })
  );

  return {
    notification,
    decision,
    scheduled: true
  };
};

const cancelNotification = async (userId, payload) => {
  const notification = await assertNotificationAccess(userId, payload.notificationId);
  const updated = await schedulerService.cancelNotification(notification);

  return {
    notification: updated,
    cancelled: true
  };
};

const rescheduleNotification = async (userId, payload) => {
  const notification = await assertNotificationAccess(userId, payload.notificationId);
  const updated = await schedulerService.rescheduleNotification(
    notification,
    payload.scheduledTime
  );

  return {
    notification: updated,
    rescheduled: true
  };
};

const retryFailedNotification = async (userId, payload) => {
  const notification = await assertNotificationAccess(userId, payload.notificationId);

  if (notification.status !== 'Failed') {
    throw new AppError('Only failed notifications can be retried.', 409);
  }

  const storedToken =
    notification.deviceToken &&
    notification.deviceToken !== 'MULTIPLE_DEVICES' &&
    !notification.deviceToken.includes(',')
      ? notification.deviceToken
      : null;

  return sendNotification(userId, {
    reminderId: notification.reminderId,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    priority: notification.priority,
    deviceToken: payload.deviceToken || storedToken,
    context: payload.context
  });
};

const getNotificationHistory = async (userId, query = {}) => {
  return notificationHistoryService.getNotificationHistory(userId, query);
};

const getNotificationDetails = async (userId, notificationId) => {
  const details = await notificationHistoryService.getNotificationDetails(notificationId);

  if (!details.notification) {
    throw new AppError('Notification not found.', 404);
  }

  if (details.notification.userId !== userId) {
    throw new AppError('You are not authorized to access this notification.', 403);
  }

  return details;
};

const createLocalNotificationRequest = async (userId, payload) => {
  const reminder = await assertReminderAccess(userId, payload.reminderId);
  const decision = await evaluateNotificationDecision({ userId, reminder, payload });

  if (!decision.shouldNotify) {
    return createSuppressedNotification({ userId, reminder, payload, decision });
  }

  const template = buildNotificationTemplate({
    reminder,
    type: payload.type || 'Context Reminder',
    decisionReason: decision.decisionReason
  });

  return {
    localNotificationRequest: {
      title: payload.title || template.title,
      body: payload.body || template.body,
      data: {
        reminderId: reminder.reminderId,
        type: payload.type || template.type,
        actionButtons: template.actionButtons
      }
    },
    decision
  };
};

module.exports = {
  registerDeviceToken,
  updateDeviceToken,
  deleteDeviceToken,
  sendNotification,
  createLocalNotificationRequest,
  scheduleNotification,
  cancelNotification,
  rescheduleNotification,
  retryFailedNotification,
  getNotificationHistory,
  getNotificationDetails
};
