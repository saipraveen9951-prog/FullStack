import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  return next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
