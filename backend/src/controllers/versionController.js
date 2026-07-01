const packageJson = require('../../package.json');
const appConfig = require('../config/appConfig');
const response = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getVersion = asyncHandler(async (req, res) => {
  return response.success(res, {
    statusCode: 200,
    message: 'API version details fetched successfully.',
    data: {
      name: packageJson.name,
      version: packageJson.version,
      apiVersion: appConfig.apiVersion,
      nodeVersion: process.version
    }
  });
});

module.exports = {
  getVersion
};
