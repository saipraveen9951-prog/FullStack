import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env.js';
import * as schema from '../db/schema.js';

const { Pool } = pg;

// Build SSL config — required for cloud providers like Neon, Supabase, Railway, etc.
const isCloudDb =
  env.DATABASE_URL.includes('neon.tech') ||
  env.DATABASE_URL.includes('supabase') ||
  env.DATABASE_URL.includes('railway') ||
  env.NODE_ENV === 'production';

const sslConfig = isCloudDb ? { rejectUnauthorized: false } : false;

// Connection Pool Configuration
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: sslConfig,
  max: env.NODE_ENV === 'production' ? 20 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

// Configure Drizzle client
export const db = drizzle(pool, { schema });
