CREATE TABLE IF NOT EXISTS "company_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"sub_category_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_category" ADD CONSTRAINT "company_category_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_category" ADD CONSTRAINT "company_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_category" ADD CONSTRAINT "company_category_sub_category_id_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_category_company_id_idx" ON "company_category" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_category_category_id_idx" ON "company_category" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_category_sub_category_id_idx" ON "company_category" USING btree ("sub_category_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "company_category_unique" ON "company_category" USING btree ("company_id","category_id","sub_category_id");