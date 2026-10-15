import { pgTable, serial, text, json, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// For generic website content (e.g., hero text, chairman message, etc)
export const contentBlocks = pgTable('content_blocks', {
  id: text('id').primaryKey(), // e.g., 'hero_title', 'chairman_message'
  value: text('value').notNull(),
  valueAr: text('value_ar'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// For projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  location: text('location').notNull(),
  locationAr: text('location_ar'),
  city: text('city').notNull(),
  cityAr: text('city_ar'),
  projectSpace: text('project_space'),
  projectSpaceAr: text('project_space_ar'),
  builtUpArea: text('built_up_area'),
  builtUpAreaAr: text('built_up_area_ar'),
  construction: text('construction'),
  constructionAr: text('construction_ar'),
  product: text('product').notNull(),
  productAr: text('product_ar'),
  finishing: text('finishing'),
  finishingAr: text('finishing_ar'),
  delivery: text('delivery'),
  deliveryAr: text('delivery_ar'),
  extraDetails: json('extra_details'), // Store as JSON object
  extraDetailsAr: json('extra_details_ar'),
  gallery: json('gallery').notNull(), // Store array of image URLs
  description: text('description'),
  descriptionAr: text('description_ar'),
  brochureUrl: text('brochure_url'),
  brochureUrlAr: text('brochure_url_ar'),
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

export const visitBookings = pgTable('visit_bookings', {
  id: serial('id').primaryKey(),
  projectName: text('project_name').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  visitDate: text('visit_date').notNull(),
  status: text('status').default('pending').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
