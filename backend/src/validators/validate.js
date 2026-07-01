const { validationResult } = require('express-validator');

const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));

  return next(new AppError('Validation failed.', 422, true, errors));
};

module.exports = validate;
