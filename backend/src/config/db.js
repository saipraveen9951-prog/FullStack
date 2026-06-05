import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env.js';
import * as schema from '../db/schema.js';

const { Pool } = pg;

// Connection Pool Configuration
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 20 : 5, // Connection pool sizing
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

// Configure Drizzle client
export const db = drizzle(pool, { schema });
