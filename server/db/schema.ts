import { pgTable, serial, text, json, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// For generic website content (e.g., hero text, chairman message, etc)
export const contentBlocks = pgTable('content_blocks', {
  id: text('id').primaryKey(), // e.g., 'hero_title', 'chairman_message'
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// For projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  city: text('city').notNull(),
  projectSpace: text('project_space'),
  builtUpArea: text('built_up_area'),
  construction: text('construction'),
  product: text('product').notNull(),
  finishing: text('finishing'),
  delivery: text('delivery'),
  extraDetails: json('extra_details'), // Store as JSON object
  gallery: json('gallery').notNull(), // Store array of image URLs
  description: text('description'),
  featured: boolean('featured').default(false).notNull(),
  logo: text('logo'),
  showInHero: boolean('show_in_hero').default(true).notNull(),
  orbitRing: integer('orbit_ring').default(2).notNull(),
  orbitPosition: integer('orbit_position').default(0).notNull(),
  orbitSpeed: text('orbit_speed').default('normal'),
  orbitDirection: text('orbit_direction').default('clockwise'),
  orbitOpacity: text('orbit_opacity').default('0.85'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const directMessages = pgTable('direct_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
