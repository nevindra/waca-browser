CREATE TYPE "public"."format" AS ENUM('EPUB', 'PDF');--> statement-breakpoint
CREATE TABLE "highlights" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"user_book_id" uuid NOT NULL,
	"content" text NOT NULL,
	"cfi_range" varchar,
	"page_number" integer,
	"x_offset" real,
	"y_offset" real,
	"width" real,
	"height" real,
	"color" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"user_book_id" uuid NOT NULL,
	"highlights_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"isbn" varchar,
	"format" "format" NOT NULL,
	"file_url" varchar NOT NULL,
	"is_starred" boolean DEFAULT false,
	"current_page" integer DEFAULT 0,
	"reading_progress" real DEFAULT 0,
	"last_read" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"profile_photo_url" varchar,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_user_book_id_user_books_id_fk" FOREIGN KEY ("user_book_id") REFERENCES "public"."user_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_book_id_user_books_id_fk" FOREIGN KEY ("user_book_id") REFERENCES "public"."user_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_highlights_id_highlights_id_fk" FOREIGN KEY ("highlights_id") REFERENCES "public"."highlights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;