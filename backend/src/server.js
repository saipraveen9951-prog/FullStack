import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { logger } from './utils/logger.js';

let server;

// Establish database pool client check and start server
const startServer = async () => {
  try {
    // Attempt database check
    const client = await pool.connect();
    logger.info('✅ PostgreSQL database connection checked successfully');
    client.release();

    // Start HTTP Server listener
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('❌ Database connection failed. Aborting startup.', error);
    process.exit(1);
  }
};

startServer();

// Handle graceful connection shutdowns
const handleGracefulShutdown = () => {
  logger.info('Termination signal received: Closing HTTP server...');
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await pool.end();
        logger.info('PostgreSQL connection pool closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing PostgreSQL connection pool:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', handleGracefulShutdown);
process.on('SIGINT', handleGracefulShutdown);
