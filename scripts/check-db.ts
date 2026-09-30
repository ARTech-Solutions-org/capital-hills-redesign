import { db } from '../server/db/index.js';
import { sql } from 'drizzle-orm';

async function check() {
  const result = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position`);
  console.log('Columns:', result.rows);
  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
