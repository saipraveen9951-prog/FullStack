import { env } from '../config/env.js';

export const logger = {
  info: (...args) => {
    console.log(`[INFO] ${new Date().toISOString()}:`, ...args);
  },
  error: (...args) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, ...args);
  },
  warn: (...args) => {
    console.warn(`[WARN] ${new Date().toISOString()}:`, ...args);
  },
  debug: (...args) => {
    if (env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${new Date().toISOString()}:`, ...args);
    }
  }
};

// Morgan stream integration
export const loggerStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};
