CREATE SCHEMA "cms";
--> statement-breakpoint
CREATE TABLE "cms"."admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) DEFAULT 'Admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cms"."content_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(40) NOT NULL,
	"entity_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"payload" jsonb NOT NULL,
	"note" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" uuid
);
--> statement-breakpoint
CREATE TABLE "cms"."media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"url" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"mime_type" varchar(120) NOT NULL,
	"byte_size" integer DEFAULT 0 NOT NULL,
	"width" integer,
	"height" integer,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms"."product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms"."products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" varchar(120) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" varchar(40) NOT NULL,
	"short_description" text DEFAULT '' NOT NULL,
	"full_description" text DEFAULT '' NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'NZD' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"online_ordering_enabled" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"badge" varchar(80),
	"tier" varchar(80),
	"note" text,
	"ingredients" text,
	"allergens" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"shop_sort_order" integer DEFAULT 0 NOT NULL,
	"show_in_box_builder" boolean DEFAULT false NOT NULL,
	"box_builder_sort_order" integer DEFAULT 0 NOT NULL,
	"builder_title" varchar(200),
	"builder_subtitle" text,
	"primary_image_id" uuid,
	"draft_payload" jsonb,
	"has_unpublished_changes" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "cms"."publish_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(40) NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar(40) NOT NULL,
	"actor_id" uuid,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms"."site_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(80) NOT NULL,
	"draft_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"has_unpublished_changes" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "cms"."content_revisions" ADD CONSTRAINT "content_revisions_published_by_admins_id_fk" FOREIGN KEY ("published_by") REFERENCES "cms"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."media" ADD CONSTRAINT "media_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "cms"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."product_images" ADD CONSTRAINT "product_images_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."products" ADD CONSTRAINT "products_primary_image_id_media_id_fk" FOREIGN KEY ("primary_image_id") REFERENCES "cms"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."products" ADD CONSTRAINT "products_updated_by_admins_id_fk" FOREIGN KEY ("updated_by") REFERENCES "cms"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."publish_events" ADD CONSTRAINT "publish_events_actor_id_admins_id_fk" FOREIGN KEY ("actor_id") REFERENCES "cms"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cms"."site_documents" ADD CONSTRAINT "site_documents_updated_by_admins_id_fk" FOREIGN KEY ("updated_by") REFERENCES "cms"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_revisions_entity_rev_uidx" ON "cms"."content_revisions" USING btree ("entity_type","entity_id","revision_number");--> statement-breakpoint
CREATE INDEX "content_revisions_entity_idx" ON "cms"."content_revisions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_storage_key_uidx" ON "cms"."media" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "product_images_product_idx" ON "cms"."product_images" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_product_id_uidx" ON "cms"."products" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_uidx" ON "cms"."products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "cms"."products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_available_idx" ON "cms"."products" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "publish_events_created_idx" ON "cms"."publish_events" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "site_documents_key_uidx" ON "cms"."site_documents" USING btree ("key");