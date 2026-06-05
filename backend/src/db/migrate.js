import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../config/db.js';
import { logger } from '../utils/logger.js';

const runMigrations = async () => {
  logger.info('⏳ Running database migrations...');
  try {
    // Execute migrator targeting output migrations directory
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    logger.info('✅ Database migrations applied successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database migrations failed:', error);
    await pool.end();
    process.exit(1);
  }
};

runMigrations();
