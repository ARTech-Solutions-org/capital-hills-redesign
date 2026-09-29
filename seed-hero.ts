import { db } from './server/db/index.js';
import { contentBlocks } from './server/db/schema.js';

async function seedContent() {
  console.log('Seeding hero content...');
  
  const blocks = [
    { id: 'hero_title', value: 'Invest With' },
    { id: 'hero_title_2', value: 'Trust' },
    { id: 'hero_title_3', value: 'Grow' },
    { id: 'hero_title_4', value: 'With' },
    { id: 'hero_title_5', value: 'Community' },
  ];

  for (const block of blocks) {
    try {
      await db.insert(contentBlocks)
        .values(block)
        .onConflictDoUpdate({
          target: contentBlocks.id,
          set: { value: block.value }
        });
      console.log(`Upserted ${block.id}`);
    } catch (e) {
      console.log(`Failed to upsert ${block.id}: ${e.message}`);
    }
  }
  
  console.log('Done.');
  process.exit(0);
}

seedContent();
