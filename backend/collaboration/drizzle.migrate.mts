import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const user = 'user';
const password = 'user';
const url = 'localhost';
const database = 'Collaboration';
const port = 5434;

const CONNECTION_STRING = `postgresql://${user}:${password}@${url}:${port}/${database}`;

const sql = postgres(CONNECTION_STRING, { max: 1 });

const db = drizzle(sql);

await migrate(db, { migrationsFolder: 'drizzle' });
await sql.end();