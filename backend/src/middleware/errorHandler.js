const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const response = require('../utils/response');

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.message === 'Origin is not allowed by CORS') {
    return new AppError(error.message, 403);
  }

  return new AppError('Internal server error.', 500, false, {
    originalMessage: error.message
  });
};

const errorHandler = (error, req, res, next) => {
  const normalizedError = normalizeError(error);

  if (!normalizedError.isOperational) {
    logger.error('Unexpected application error', error);
  }

  return response.error(res, {
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    errors: normalizedError.errors,
    requestId: req.requestId
  });
};

module.exports = errorHandler;
