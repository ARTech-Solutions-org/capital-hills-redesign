import { db } from '../server/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Creating visit_bookings table if not exists...');
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS visit_bookings (
      id SERIAL PRIMARY KEY,
      project_name TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL,
      is_read BOOLEAN DEFAULT FALSE NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  const tables = await db.execute(sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema='public'
  `);
  console.log('Public tables in DB:', tables.rows.map((r: any) => r.table_name));
  process.exit(0);
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
