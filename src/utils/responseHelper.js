const sendSuccess = (res, statusCode, message, data = null ) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, errors = [], data = null) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data,
  });
};

module.exports = { sendSuccess, sendError };
