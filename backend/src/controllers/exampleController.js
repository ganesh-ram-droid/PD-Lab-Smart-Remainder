const response = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getExample = asyncHandler(async (req, res) => {
  const name = req.query.name || 'user';

  return response.success(res, {
    statusCode: 200,
    message: 'Example route executed successfully.',
    data: {
      greeting: `Hello, ${name}.`,
      purpose: 'This route demonstrates controller, route, validation, and response layers.'
    }
  });
});

module.exports = {
  getExample
};
