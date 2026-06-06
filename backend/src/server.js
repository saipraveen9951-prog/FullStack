import app from './app.js';
import { env } from './config/env.js';
import { pool, db } from './config/db.js';
import { logger } from './utils/logger.js';
import { sql } from 'drizzle-orm';

let server;

// Establish database pool client check and start server
const startServer = async () => {
  try {
    // Use a lightweight query to verify connectivity — works with Neon's pgbouncer pooler
    await db.execute(sql`SELECT 1`);
    logger.info('✅ PostgreSQL database connection verified successfully');

    // Start HTTP Server listener
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
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
