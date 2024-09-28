import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  topic: varchar('topic', { length: 255 }).array().notNull(),
  description: text('description').notNull(),
  attempted: boolean('attempted').notNull().default(false),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).defaultNow(),
});
