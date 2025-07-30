CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"path" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"bucket" varchar(100) NOT NULL,
	"user_id" uuid,
	"url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_name_idx" ON "files" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_path_idx" ON "files" USING btree ("path");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_user_id_idx" ON "files" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_bucket_idx" ON "files" USING btree ("bucket");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "files_path_unique" ON "files" USING btree ("path");