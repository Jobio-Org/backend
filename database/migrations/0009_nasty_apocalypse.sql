ALTER TABLE "company" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_slug_idx" ON "company" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "company_slug_unique" ON "company" USING btree ("slug");