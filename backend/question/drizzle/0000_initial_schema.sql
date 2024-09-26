CREATE TABLE IF NOT EXISTS "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"topic" varchar(255)[] NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now(),
	"updated_at" timestamp (6) with time zone DEFAULT now()
);
