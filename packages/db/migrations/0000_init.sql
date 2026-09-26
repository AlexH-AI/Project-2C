CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`team_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "people_role" CHECK("people"."role" IN ('RE', 'TL', 'IS', 'BD', 'BDM')),
	CONSTRAINT "people_team_required" CHECK("people"."role" NOT IN ('RE', 'TL') OR "people"."team_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE `schema_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`applied_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_active_name` ON `teams` (`name`) WHERE "teams"."deleted_at" IS NULL;