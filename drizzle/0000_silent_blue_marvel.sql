DO $$ BEGIN
 CREATE TYPE "public"."orderpair" AS ENUM('sol-btc', 'sol-usd', 'sol-eth');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"pair" "orderpair"
);
