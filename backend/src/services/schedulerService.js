const notificationModel = require('../models/notificationModel');
const notificationHistoryService = require('./notificationHistoryService');
const AppError = require('../utils/AppError');

const assertFutureTime = (scheduledTime) => {
  const parsed = new Date(scheduledTime);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError('Scheduled time must be a valid date-time.', 422);
  }

  if (parsed.getTime() <= Date.now()) {
    throw new AppError('Scheduled time must be in the future.', 422);
  }

  return parsed.toISOString();
};

const scheduleNotification = async (payload) => {
  const scheduledTime = assertFutureTime(payload.scheduledTime);

  const notification = await notificationModel.createNotification({
    ...payload,
    scheduledTime,
    status: 'Scheduled'
  });

  await notificationHistoryService.logNotificationAction({
    notificationId: notification.notificationId,
    action: 'Schedule Notification',
    status: 'Scheduled',
    response: { scheduledTime }
  });

  return notification;
};

const cancelNotification = async (notification) => {
  if (notification.status === 'Sent') {
    throw new AppError('Notification already sent.', 409);
  }

  if (notification.status === 'Cancelled') {
    throw new AppError('Notification cancelled.', 409);
  }

  const updated = await notificationModel.updateNotification(notification.notificationId, {
    status: 'Cancelled'
  });

  await notificationHistoryService.logNotificationAction({
    notificationId: notification.notificationId,
    action: 'Cancel Notification',
    status: 'Cancelled',
    response: { previousStatus: notification.status }
  });

  return updated;
};

const rescheduleNotification = async (notification, scheduledTime) => {
  if (notification.status === 'Sent') {
    throw new AppError('Notification already sent.', 409);
  }

  if (notification.status === 'Cancelled') {
    throw new AppError('Notification cancelled.', 409);
  }

  const nextScheduledTime = assertFutureTime(scheduledTime);
  const updated = await notificationModel.updateNotification(notification.notificationId, {
    status: 'Scheduled',
    scheduledTime: nextScheduledTime
  });

  await notificationHistoryService.logNotificationAction({
    notificationId: notification.notificationId,
    action: 'Reschedule Notification',
    status: 'Scheduled',
    response: { scheduledTime: nextScheduledTime }
  });

  return updated;
};

module.exports = {
  scheduleNotification,
  cancelNotification,
  rescheduleNotification
};
