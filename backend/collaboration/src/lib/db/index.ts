import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres({
  host: 'localhost',
  port: 5434,
  database: 'Collaboration',
  user: 'user',
  password: 'user',
});

export const db = drizzle(queryClient);

export * from './schema';
