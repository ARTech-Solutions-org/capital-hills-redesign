import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function run() {
  console.log('Migrating whyus_ keys to aboutus_...');
  await db.execute(sql`UPDATE content_blocks SET id = REPLACE(id, 'whyus_', 'aboutus_') WHERE id LIKE 'whyus_%'`);
  console.log('Done!');
  process.exit(0);
}

run();
