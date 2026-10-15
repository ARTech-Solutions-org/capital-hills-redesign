import { db } from '../server/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    ALTER TABLE projects 
    ADD COLUMN IF NOT EXISTS brochure_url text,
    ADD COLUMN IF NOT EXISTS brochure_url_ar text;
  `);
  console.log('Columns brochure_url and brochure_url_ar successfully created or verified in Neon!');
}

main().catch(console.error);
