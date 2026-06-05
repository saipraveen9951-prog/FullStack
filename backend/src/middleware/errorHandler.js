import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalise it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Log error message
  logger.error(`${req.method} ${req.path} - Status: ${error.statusCode} - Message: ${error.message}`);
  
  // For server errors, log stack trace
  if (error.statusCode === 500) {
    logger.error(error.stack || 'No stack trace available');
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    // Include stack trace only in development
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};
