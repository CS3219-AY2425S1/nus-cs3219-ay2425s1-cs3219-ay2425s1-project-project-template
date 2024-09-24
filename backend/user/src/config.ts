export const JWT_SECRET_KEY = process.env.EXPRESS_JWT_SECRET_KEY!;

export const dbConfig = {
  host: process.env.EXPRESS_DB_HOST!,
  port: Number.parseInt(process.env.EXPRESS_DB_PORT!),
  database: process.env.POSTGRES_DB!,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
