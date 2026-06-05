import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    // Parse validation schemas asynchronously
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign back parsed and co-erced objects (e.g. string numbers to real ints)
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    
    return next();
  } catch (error) {
    // Format Zod errors
    const formattedErrors = error.errors?.map((err) => {
      // path is usually ['body', 'title'] or ['query', 'page']. We drop the first locator.
      const fieldName = err.path.slice(1).join('.') || err.path[0];
      return {
        field: fieldName,
        message: err.message,
      };
    }) || [];
    
    return next(new ApiError(400, 'Validation Error', formattedErrors));
  }
};
