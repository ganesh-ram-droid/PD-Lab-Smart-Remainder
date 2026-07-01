const success = (
  res,
  { statusCode = 200, message = 'Success.', data = null, meta = null }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};

const error = (
  res,
  { statusCode = 500, message = 'Internal server error.', errors = null, requestId = null }
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId
  });
};

module.exports = {
  success,
  error
};
