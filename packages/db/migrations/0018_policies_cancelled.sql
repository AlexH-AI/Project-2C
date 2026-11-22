PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_policies` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`rm_id` text NOT NULL,
	`submitted_date` text NOT NULL,
	`submitted_fyp` integer NOT NULL,
	`issued_date` text,
	`issued_fyp` integer,
	`cancelled_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rm_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "policies_submitted_fyp" CHECK("__new_policies"."submitted_fyp" > 0),
	CONSTRAINT "policies_issued_pair" CHECK(("__new_policies"."issued_date" IS NULL) = ("__new_policies"."issued_fyp" IS NULL)),
	CONSTRAINT "policies_issued" CHECK("__new_policies"."issued_date" IS NULL OR ("__new_policies"."issued_fyp" > 0 AND "__new_policies"."issued_date" >= "__new_policies"."submitted_date")),
	CONSTRAINT "policies_cancelled" CHECK("__new_policies"."cancelled_date" IS NULL OR ("__new_policies"."issued_date" IS NOT NULL AND "__new_policies"."cancelled_date" >= "__new_policies"."issued_date"))
);
--> statement-breakpoint
INSERT INTO `__new_policies`("id", "customer_id", "rm_id", "submitted_date", "submitted_fyp", "issued_date", "issued_fyp", "cancelled_date", "created_at", "updated_at", "deleted_at") SELECT "id", "customer_id", "rm_id", "submitted_date", "submitted_fyp", "issued_date", "issued_fyp", "cancelled_date", "created_at", "updated_at", "deleted_at" FROM `policies`;--> statement-breakpoint
DROP TABLE `policies`;--> statement-breakpoint
ALTER TABLE `__new_policies` RENAME TO `policies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `policies_customer` ON `policies` (`customer_id`);