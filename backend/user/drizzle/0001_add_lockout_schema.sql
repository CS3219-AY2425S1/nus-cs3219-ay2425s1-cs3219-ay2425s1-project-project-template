ALTER TABLE "users" ADD COLUMN "failed_attempts" smallint DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unlock_time" timestamp (6) with time zone;