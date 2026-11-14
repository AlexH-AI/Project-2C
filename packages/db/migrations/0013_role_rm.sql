-- A2 (spec Phase 6 phản hồi §3.3): RE becomes RM as the rows are copied, the role of people and
-- the source of KYC notes; the only change to what drizzle-kit generated. 0014 makes the triggers
-- of kyc_notes again.
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_kyc_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`text` text NOT NULL,
	`created_date` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "kyc_notes_source" CHECK("__new_kyc_notes"."source" IN ('RM', 'SYSTEM'))
);
--> statement-breakpoint
INSERT INTO `__new_kyc_notes`("id", "customer_id", "seq", "text", "created_date", "source", "created_at") SELECT "id", "customer_id", "seq", "text", "created_date", CASE "source" WHEN 'RE' THEN 'RM' ELSE "source" END, "created_at" FROM `kyc_notes`;--> statement-breakpoint
DROP TABLE `kyc_notes`;--> statement-breakpoint
ALTER TABLE `__new_kyc_notes` RENAME TO `kyc_notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `kyc_notes_customer_seq` ON `kyc_notes` (`customer_id`,`seq`);--> statement-breakpoint
CREATE TABLE `__new_people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`team_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "people_role" CHECK("__new_people"."role" IN ('RM', 'TL', 'IS', 'BD', 'BDM')),
	CONSTRAINT "people_team_required" CHECK("__new_people"."role" NOT IN ('RM', 'TL') OR "__new_people"."team_id" IS NOT NULL),
	CONSTRAINT "people_team_none" CHECK("__new_people"."role" IN ('RM', 'TL') OR "__new_people"."team_id" IS NULL)
);
--> statement-breakpoint
INSERT INTO `__new_people`("id", "name", "role", "team_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", CASE "role" WHEN 'RE' THEN 'RM' ELSE "role" END, "team_id", "created_at", "updated_at", "deleted_at" FROM `people`;--> statement-breakpoint
DROP TABLE `people`;--> statement-breakpoint
ALTER TABLE `__new_people` RENAME TO `people`;