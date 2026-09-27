import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in environment variables!");
}
const sql = neon(process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy/dummy');
export const db = drizzle(sql, { schema });
