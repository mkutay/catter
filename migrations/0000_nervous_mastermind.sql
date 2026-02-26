-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"body" text NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "guestbook" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "views" (
	"slug" text PRIMARY KEY NOT NULL,
	"count" integer
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"slug" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"excerpt" text NOT NULL,
	"locale" text NOT NULL,
	"cover" text,
	"coversquare" text,
	"lastmodified" timestamp NOT NULL,
	"shortened" varchar(255) NOT NULL,
	"shortexcerpt" text
);
--> statement-breakpoint
CREATE TABLE "post_keywords" (
	"slug" varchar(255) NOT NULL,
	"keyword" text NOT NULL,
	CONSTRAINT "post_keywords_pkey" PRIMARY KEY("slug","keyword")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"slug" varchar(255) NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "post_tags_pkey" PRIMARY KEY("tag","slug")
);
--> statement-breakpoint
ALTER TABLE "post_keywords" ADD CONSTRAINT "post_keywords_slug_fkey" FOREIGN KEY ("slug") REFERENCES "public"."posts"("slug") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_slug_fkey" FOREIGN KEY ("slug") REFERENCES "public"."posts"("slug") ON DELETE cascade ON UPDATE cascade;
*/