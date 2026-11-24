CREATE TABLE `team_targets` (
	`team_id` text NOT NULL,
	`month` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`team_id`, `month`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "team_targets_amount" CHECK("team_targets"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD `expected_case_size_at` text;