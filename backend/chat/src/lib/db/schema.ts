import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const tableName = pgTable('tableName', {
  id: uuid('id').unique().primaryKey().defaultRandom(),
});
