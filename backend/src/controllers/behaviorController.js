const behaviorService = require('../services/behaviorService');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');

const logBehavior = asyncHandler(async (req, res) => {
  const result = await behaviorService.logBehavior(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.duplicate ? 200 : 201,
    message: result.duplicate
      ? 'Duplicate behavior log returned successfully.'
      : 'Behavior log stored successfully.',
    data: result
  });
});

const getBehaviorHistory = asyncHandler(async (req, res) => {
  const history = await behaviorService.getBehaviorHistory(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Behavior history fetched successfully.',
    data: history
  });
});

const getLearningProfile = asyncHandler(async (req, res) => {
  const profile = await behaviorService.getLearningProfile(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'Learning profile fetched successfully.',
    data: profile
  });
});

const analyzeUserBehavior = asyncHandler(async (req, res) => {
  const analysis = await behaviorService.analyzeUserBehavior(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'User behavior analyzed successfully.',
    data: analysis
  });
});

const predictBestReminderContext = asyncHandler(async (req, res) => {
  const prediction = await behaviorService.predictBestReminderContext(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'Best reminder context predicted successfully.',
    data: prediction
  });
});

module.exports = {
  logBehavior,
  getBehaviorHistory,
  getLearningProfile,
  analyzeUserBehavior,
  predictBestReminderContext
};
