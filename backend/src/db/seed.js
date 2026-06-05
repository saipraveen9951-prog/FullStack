import { db, pool } from '../config/db.js';
import { todos } from './schema.js';
import { logger } from '../utils/logger.js';
import { count } from 'drizzle-orm';

const seed = async () => {
  logger.info('⏳ Seeding database...');
  try {
    const existing = await db.select({ total: count() }).from(todos);
    if (existing[0]?.total > 0) {
      logger.info('🌱 Database already contains data. Seeding skipped.');
      await pool.end();
      return;
    }

    await db.insert(todos).values([
      {
        title: '👋 Welcome to Todo Manager API!',
        description: 'This is a sample task seeded from the database.',
        completed: false,
      },
      {
        title: '🚀 Learn Express.js and Drizzle ORM',
        description: 'Build enterprise-grade REST APIs following industry best practices.',
        completed: false,
      },
      {
        title: '🔒 Secure endpoints using Helmet and CORS',
        description: 'Apply production security controls.',
        completed: true,
      },
    ]);

    logger.info('✅ Database seeding completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
};

seed();
