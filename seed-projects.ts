import { db } from './server/db';
import { projects as projectsTable } from './server/db/schema';
import { projects } from './src/data/projects';

async function run() {
  console.log('Seeding projects...');
  for (const project of projects) {
    try {
      await db.insert(projectsTable).values({
        slug: project.slug,
        name: project.name,
        location: project.location,
        city: project.city,
        projectSpace: project.projectSpace || null,
        builtUpArea: project.builtUpArea || null,
        construction: project.construction || null,
        product: project.product,
        finishing: project.finishing || null,
        delivery: project.delivery || null,
        description: project.description || null,
        gallery: project.gallery || [],
        extraDetails: project.extraDetails || null
      });
      console.log(`Inserted ${project.name}`);
    } catch (e: any) {
      console.log(`Skipped ${project.name} or error occurred: ${e.message}`);
    }
  }
  console.log('Done seeding projects.');
  process.exit(0);
}

run();
