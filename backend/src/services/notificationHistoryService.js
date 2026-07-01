const notificationModel = require('../models/notificationModel');

const logNotificationAction = async ({ notificationId, action, status, response }) => {
  return notificationModel.createNotificationLog({
    notificationId,
    action,
    status,
    response
  });
};

const getNotificationHistory = async (userId, query = {}) => {
  const limit = query.limit ? Number(query.limit) : 50;
  const status = query.status || null;

  return notificationModel.getNotificationsByUser(userId, {
    limit,
    status
  });
};

const getNotificationDetails = async (notificationId) => {
  const notification = await notificationModel.getNotificationById(notificationId);
  const logs = notification
    ? await notificationModel.getNotificationLogs(notificationId)
    : [];

  return {
    notification,
    logs
  };
};

module.exports = {
  logNotificationAction,
  getNotificationHistory,
  getNotificationDetails
};
