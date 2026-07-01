const notificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');

const registerDeviceToken = asyncHandler(async (req, res) => {
  const token = await notificationService.registerDeviceToken(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'Device token registered successfully.',
    data: token
  });
});

const updateDeviceToken = asyncHandler(async (req, res) => {
  const token = await notificationService.updateDeviceToken(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Device token updated successfully.',
    data: token
  });
});

const deleteDeviceToken = asyncHandler(async (req, res) => {
  const token = await notificationService.deleteDeviceToken(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Device token deleted successfully.',
    data: token
  });
});

const sendNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.sendNotification(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.sent ? 201 : 200,
    message: result.sent ? 'Notification sent successfully.' : 'Notification suppressed.',
    data: result
  });
});

const createLocalNotificationRequest = asyncHandler(async (req, res) => {
  const result = await notificationService.createLocalNotificationRequest(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: result.localNotificationRequest
      ? 'Local notification request generated successfully.'
      : 'Local notification request suppressed.',
    data: result
  });
});

const scheduleNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.scheduleNotification(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.scheduled ? 201 : 200,
    message: result.scheduled ? 'Notification scheduled successfully.' : 'Notification suppressed.',
    data: result
  });
});

const cancelNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.cancelNotification(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Notification cancelled successfully.',
    data: result
  });
});

const rescheduleNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.rescheduleNotification(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Notification rescheduled successfully.',
    data: result
  });
});

const retryFailedNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.retryFailedNotification(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.sent ? 201 : 200,
    message: result.sent ? 'Failed notification retried successfully.' : 'Retry suppressed.',
    data: result
  });
});

const getNotificationHistory = asyncHandler(async (req, res) => {
  const history = await notificationService.getNotificationHistory(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Notification history fetched successfully.',
    data: history
  });
});

const getNotificationDetails = asyncHandler(async (req, res) => {
  const details = await notificationService.getNotificationDetails(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Notification details fetched successfully.',
    data: details
  });
});

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
