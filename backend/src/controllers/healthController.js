const response = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getHealth = asyncHandler(async (req, res) => {
  return response.success(res, {
    statusCode: 200,
    message: 'Health check successful.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

module.exports = {
  getHealth
};
