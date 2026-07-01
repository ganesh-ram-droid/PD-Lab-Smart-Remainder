const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const analyticsService = require('../services/analyticsService');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboard(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Dashboard summary fetched successfully.',
    data
  });
});

const getReminderAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getReminderAnalytics(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder analytics fetched successfully.',
    data
  });
});

const getNotificationAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getNotificationAnalytics(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Notification analytics fetched successfully.',
    data
  });
});

const getContextAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getContextAnalytics(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Context analytics fetched successfully.',
    data
  });
});

const getBehaviorAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getBehaviorAnalytics(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Behavior analytics fetched successfully.',
    data
  });
});

const getLocationAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLocationAnalytics(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Location analytics fetched successfully.',
    data
  });
});

const getCharts = asyncHandler(async (req, res) => {
  const data = await analyticsService.buildCharts(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Chart data prepared successfully.',
    data
  });
});

const getReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAnalyticsReport(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Analytics report generated successfully.',
    data
  });
});

module.exports = {
  getDashboard,
  getReminderAnalytics,
  getNotificationAnalytics,
  getContextAnalytics,
  getBehaviorAnalytics,
  getLocationAnalytics,
  getCharts,
  getReport
};
