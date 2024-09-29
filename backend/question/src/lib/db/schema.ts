import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  topic: varchar('topic', { length: 255 }).array().notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).defaultNow(),
});
