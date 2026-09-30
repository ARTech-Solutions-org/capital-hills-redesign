import { db } from '../server/db/index.js';
import { sql } from 'drizzle-orm';
import { projects } from '../src/data/projects.js';

async function run() {
  console.log('Activating and distributing all logos across 2 rings...');

  // 11 projects total
  // Ring 1 (Inner - r=180): 5 projects
  // Ring 2 (Outer - r=320): 6 projects

  const dist = {
    'la-colina-east': { ring: 1, pos: 0 },
    'la-colina-west': { ring: 1, pos: 72 },
    'park-point': { ring: 1, pos: 144 },
    'capital-towers': { ring: 1, pos: 216 },
    'park-yard-1': { ring: 1, pos: 288 },

    'win-plaza': { ring: 2, pos: 0 },
    'park-yard-2': { ring: 2, pos: 60 },
    'point-9': { ring: 2, pos: 120 },
    'point-11': { ring: 2, pos: 180 },
    'east-point': { ring: 2, pos: 240 },
    'capital-green': { ring: 2, pos: 300 }
  };

  for (const project of projects) {
    const config = (dist as any)[project.slug];
    if (config) {
      await db.execute(sql`
        UPDATE projects
        SET show_in_hero = true,
            orbit_ring = ${config.ring},
            orbit_position = ${config.pos},
            orbit_opacity = '0.90'
        WHERE slug = ${project.slug}
      `);
      console.log(`Updated ${project.slug} -> Ring ${config.ring} @ ${config.pos}deg`);
    }
  }
  
  console.log('Done!');
  process.exit(0);
}

run().catch(console.error);
