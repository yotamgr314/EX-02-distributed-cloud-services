const { logError } = require('../utils/logger');

// Error Response Helper
const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

// Specific Error Handlers
const handleValidationError = (res) => sendErrorResponse(res, 400, 'Bad Request: Validation Error');
const handleJwtError = (res) => sendErrorResponse(res, 401, 'Unauthorized: Invalid Token');
const handleTokenExpiredError = (res) => sendErrorResponse(res, 401, 'Unauthorized: Token Expired');
const handleCastError = (res) => sendErrorResponse(res, 400, 'Bad Request: Invalid ID format');

// Main Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let errorMessage = err.message || 'Internal Server Error';

  // Log the error using winston
  logError(`${req.method} ${req.originalUrl} - ${errorMessage}`);

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      return handleValidationError(res);
    case 'JsonWebTokenError':
      return handleJwtError(res);
    case 'TokenExpiredError':
      return handleTokenExpiredError(res);
    case 'CastError':
      return handleCastError(res);
    default:
      sendErrorResponse(res, statusCode, errorMessage);
  }
};

module.exports = errorHandler;
