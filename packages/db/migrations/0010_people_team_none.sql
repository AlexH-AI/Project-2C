PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`team_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "people_role" CHECK("__new_people"."role" IN ('RE', 'TL', 'IS', 'BD', 'BDM')),
	CONSTRAINT "people_team_required" CHECK("__new_people"."role" NOT IN ('RE', 'TL') OR "__new_people"."team_id" IS NOT NULL),
	CONSTRAINT "people_team_none" CHECK("__new_people"."role" IN ('RE', 'TL') OR "__new_people"."team_id" IS NULL)
);
--> statement-breakpoint
INSERT INTO `__new_people`("id", "name", "role", "team_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "role", "team_id", "created_at", "updated_at", "deleted_at" FROM `people`;--> statement-breakpoint
DROP TABLE `people`;--> statement-breakpoint
ALTER TABLE `__new_people` RENAME TO `people`;--> statement-breakpoint
PRAGMA foreign_keys=ON;