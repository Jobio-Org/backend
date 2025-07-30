DROP INDEX IF EXISTS "candidate_profile_position_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "company_industry_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "company_is_active_idx";--> statement-breakpoint
ALTER TABLE "company" DROP COLUMN IF EXISTS "industry";