const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const contextEvaluationService = require('../services/contextEvaluationService');

const evaluateContext = asyncHandler(async (req, res) => {
  const result = await contextEvaluationService.evaluateContext(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.duplicate ? 200 : 201,
    message: result.duplicate
      ? 'Duplicate context evaluation returned successfully.'
      : 'Context evaluated successfully.',
    data: result
  });
});

const storeContextLog = asyncHandler(async (req, res) => {
  const result = await contextEvaluationService.storeContextLog(req.user.uid, req.body);

  return response.success(res, {
    statusCode: result.duplicate ? 200 : 201,
    message: result.duplicate ? 'Duplicate context log returned successfully.' : 'Context log stored successfully.',
    data: result
  });
});

const getContextHistory = asyncHandler(async (req, res) => {
  const logs = await contextEvaluationService.getContextHistory(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Context history fetched successfully.',
    data: logs
  });
});

const calculateCurrentScore = asyncHandler(async (req, res) => {
  const result = await contextEvaluationService.calculateCurrentScore(
    req.user.uid,
    req.params.reminderId,
    req.query
  );

  return response.success(res, {
    statusCode: 200,
    message: 'Current context score calculated successfully.',
    data: result
  });
});

module.exports = {
  evaluateContext,
  storeContextLog,
  getContextHistory,
  calculateCurrentScore
};
