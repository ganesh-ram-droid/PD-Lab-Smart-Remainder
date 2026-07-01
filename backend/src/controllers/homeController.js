const response = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getHome = asyncHandler(async (req, res) => {
  return response.success(res, {
    statusCode: 200,
    message: 'Context Reminder backend is running.',
    data: {
      service: 'Dynamic Contextual Relevance Evaluation System',
      documentation: '/api/version'
    }
  });
});

module.exports = {
  getHome
};
