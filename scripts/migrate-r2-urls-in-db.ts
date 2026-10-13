import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../server/db/index.js';
import { contentBlocks, projects } from '../server/db/schema.js';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-a65c9d47cabf42adb5dfcea375307447.r2.dev';

async function main() {
  console.log(`Checking database for references to "${R2_PUBLIC_URL}" or other R2 URLs...`);

  // 1. Check contentBlocks
  const blocks = await db.select().from(contentBlocks);
  let updatedBlocks = 0;
  for (const block of blocks) {
    if (block.value && (block.value.includes('r2.dev') || block.value.includes('cloudflarestorage.com'))) {
      console.log(`Found R2 reference in content_block "${block.id}":`, block.value);
      // Replace R2 url with /uploads/
      const regex = /https?:\/\/[^\s"'<>]+\.r2\.dev\/([^\s"'<>]+)/g;
      const newValue = block.value.replace(regex, '/uploads/$1');
      if (newValue !== block.value) {
        await db.update(contentBlocks)
          .set({ value: newValue, updatedAt: new Date() })
          .where(eq(contentBlocks.id, block.id));
        console.log(`Updated content_block "${block.id}" to:`, newValue);
        updatedBlocks++;
      }
    }
  }

  // 2. Check projects
  const allProjects = await db.select().from(projects);
  let updatedProjects = 0;
  for (const proj of allProjects) {
    let changed = false;
    let newLogo = proj.logo;
    let newGallery = proj.gallery ? [...(proj.gallery as string[])] : [];

    if (newLogo && (newLogo.includes('r2.dev') || newLogo.includes('cloudflarestorage.com'))) {
      const match = newLogo.match(/\/([^\/?#]+)$/);
      if (match) {
        newLogo = `/uploads/${match[1]}`;
        changed = true;
      }
    }

    if (Array.isArray(newGallery)) {
      newGallery = newGallery.map((imgUrl) => {
        if (typeof imgUrl === 'string' && (imgUrl.includes('r2.dev') || imgUrl.includes('cloudflarestorage.com'))) {
          const match = imgUrl.match(/\/([^\/?#]+)$/);
          if (match) {
            changed = true;
            return `/uploads/${match[1]}`;
          }
        }
        return imgUrl;
      });
    }

    if (changed) {
      console.log(`Updating project "${proj.name}" (ID: ${proj.id})...`);
      await db.update(projects)
        .set({
          logo: newLogo,
          gallery: newGallery,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, proj.id));
      updatedProjects++;
    }
  }

  console.log(`Done! Updated ${updatedBlocks} content blocks and ${updatedProjects} projects.`);
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
