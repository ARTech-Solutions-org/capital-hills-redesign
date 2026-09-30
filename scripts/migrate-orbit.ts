import { db } from '../server/db/index.js';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Running orbit migration...');
  
  // 1. Add columns to projects table
  await db.execute(sql`
    ALTER TABLE projects 
    ADD COLUMN IF NOT EXISTS logo text,
    ADD COLUMN IF NOT EXISTS show_in_hero boolean DEFAULT true NOT NULL,
    ADD COLUMN IF NOT EXISTS orbit_ring integer DEFAULT 2 NOT NULL,
    ADD COLUMN IF NOT EXISTS orbit_position integer DEFAULT 0 NOT NULL,
    ADD COLUMN IF NOT EXISTS orbit_speed text DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS orbit_direction text DEFAULT 'clockwise',
    ADD COLUMN IF NOT EXISTS orbit_opacity text DEFAULT '0.85';
  `);

  console.log('Columns added successfully.');

  // 2. Initial project logo and orbit configuration
  const initialOrbitConfig: Record<string, {
    logo: string;
    orbitRing: number;
    orbitPosition: number;
    orbitSpeed: string;
    orbitDirection: string;
    orbitOpacity: string;
    showInHero: boolean;
  }> = {
    'la-colina-east': {
      logo: '/project-logos/la-colina-east.png',
      orbitRing: 1,
      orbitPosition: 30,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.95',
      showInHero: true,
    },
    'la-colina-west': {
      logo: '/project-logos/la-colina-west.png',
      orbitRing: 1,
      orbitPosition: 210,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.90',
      showInHero: true,
    },
    'capital-towers': {
      logo: '/project-logos/capital-towers.png',
      orbitRing: 2,
      orbitPosition: 0,
      orbitSpeed: 'normal',
      orbitDirection: 'clockwise',
      orbitOpacity: '0.95',
      showInHero: true,
    },
    'park-yard-1': {
      logo: '/project-logos/park-yard-1.png',
      orbitRing: 2,
      orbitPosition: 90,
      orbitSpeed: 'normal',
      orbitDirection: 'clockwise',
      orbitOpacity: '0.85',
      showInHero: true,
    },
    'win-plaza': {
      logo: '/project-logos/win-plaza.png',
      orbitRing: 2,
      orbitPosition: 180,
      orbitSpeed: 'normal',
      orbitDirection: 'clockwise',
      orbitOpacity: '0.90',
      showInHero: true,
    },
    'park-yard-2': {
      logo: '/project-logos/park-yard-2.png',
      orbitRing: 2,
      orbitPosition: 270,
      orbitSpeed: 'normal',
      orbitDirection: 'clockwise',
      orbitOpacity: '0.80',
      showInHero: true,
    },
    'point-9': {
      logo: '/project-logos/point-9.png',
      orbitRing: 3,
      orbitPosition: 45,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.85',
      showInHero: true,
    },
    'point-11': {
      logo: '/project-logos/point-11.png',
      orbitRing: 3,
      orbitPosition: 135,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.80',
      showInHero: true,
    },
    'park-point': {
      logo: '/project-logos/park-point.png',
      orbitRing: 3,
      orbitPosition: 225,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.85',
      showInHero: true,
    },
    'east-point': {
      logo: '/project-logos/east-point.png',
      orbitRing: 3,
      orbitPosition: 315,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.75',
      showInHero: true,
    },
    'capital-green': {
      logo: '/project-logos/capital-green.png',
      orbitRing: 3,
      orbitPosition: 180,
      orbitSpeed: 'slow',
      orbitDirection: 'counter-clockwise',
      orbitOpacity: '0.70',
      showInHero: false, // Inactive by default so outer ring stays 4 logos and uncluttered
    },
  };

  for (const [slug, conf] of Object.entries(initialOrbitConfig)) {
    await db.execute(sql`
      UPDATE projects 
      SET 
        logo = ${conf.logo},
        orbit_ring = ${conf.orbitRing},
        orbit_position = ${conf.orbitPosition},
        orbit_speed = ${conf.orbitSpeed},
        orbit_direction = ${conf.orbitDirection},
        orbit_opacity = ${conf.orbitOpacity},
        show_in_hero = ${conf.showInHero}
      WHERE slug = ${slug}
    `);
    console.log(`Updated orbit config for ${slug}`);
  }

  console.log('Migration completed successfully!');
  process.exit(0);
}

migrate().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
