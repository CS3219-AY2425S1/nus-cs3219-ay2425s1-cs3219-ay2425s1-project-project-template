CREATE TABLE IF NOT EXISTS "tableName" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "tableName_id_unique" UNIQUE("id")
);
