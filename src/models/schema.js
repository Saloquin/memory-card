import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User table
export const users = sqliteTable('User', {
  userId: text('user_id', { length: 36 }).primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false)
});

// Level table for spaced repetition
export const levels = sqliteTable('Level', {
  levelId: integer('level_id').primaryKey(),
  daysBeforeRevision: integer('days_before_revision').notNull()
});

// Collection table
export const collections = sqliteTable('Collection', {
  collectionId: text('collection_id', { length: 36 }).primaryKey(),
  authorId: text('author_id', { length: 36 }).notNull().references(() => users.userId),
  title: text('title').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false)
});

// Card table
export const cards = sqliteTable('Card', {
  cardId: text('card_id', { length: 36 }).primaryKey(),
  collectionId: text('collection_id', { length: 36 }).notNull().references(() => collections.collectionId, { onDelete: 'cascade' }),
  recto: text('recto').notNull(),
  verso: text('verso').notNull(),
  urlRecto: text('url_recto'),
  urlVerso: text('url_verso')
});

// Revision table for tracking card progress
export const revisions = sqliteTable('Revision', {
  cardId: text('card_id', { length: 36 }).notNull().references(() => cards.cardId, { onDelete: 'cascade' }),
  userId: text('user_id', { length: 36 }).notNull().references(() => users.userId, { onDelete: 'cascade' }),
  levelId: integer('level_id').notNull().references(() => levels.levelId).default(1),
  lastRevisionDate: integer('last_revision_date', { mode: 'timestamp' }).notNull(),
  nextRevisionDate: integer('next_revision_date', { mode: 'timestamp' }).notNull()
}, (table) => ({
  pk: { primaryKey: [table.cardId, table.userId] }
}));

// CollectionAccess table for managing user access to collections
export const collectionAccess = sqliteTable('CollectionAccess', {
  userId: text('user_id', { length: 36 }).notNull().references(() => users.userId, { onDelete: 'cascade' }),
  collectionId: text('collection_id', { length: 36 }).notNull().references(() => collections.collectionId, { onDelete: 'cascade' })
}, (table) => ({
  pk: { primaryKey: [table.userId, table.collectionId] }
}));
