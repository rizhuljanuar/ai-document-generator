CREATE TABLE IF NOT EXISTS "documentation_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"original_code" text NOT NULL,
	"generated_docs" text NOT NULL,
	"language" text NOT NULL,
	"style" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
