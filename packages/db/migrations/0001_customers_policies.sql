CREATE TABLE `appointment_coordinators` (
	`appointment_id` text NOT NULL,
	`person_id` text NOT NULL,
	PRIMARY KEY(`appointment_id`, `person_id`),
	FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`re_id` text NOT NULL,
	`date` text NOT NULL,
	`time` text,
	`status` text NOT NULL,
	`trigger_type` text NOT NULL,
	`trigger_note` text,
	`stage_after` text,
	`next_step` text,
	`expected_case_size` integer,
	`note` text NOT NULL,
	`rescheduled_from_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`re_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rescheduled_from_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "appointments_status" CHECK("appointments"."status" IN ('SCHEDULED', 'MET', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW')),
	CONSTRAINT "appointments_trigger" CHECK("appointments"."trigger_type" IN ('REFERRAL', 'ASSET_MATURITY', 'EVENT', 'OCCASION', 'OTHER')),
	CONSTRAINT "appointments_stage_after" CHECK("appointments"."stage_after" IS NULL OR ("appointments"."status" = 'MET' AND "appointments"."stage_after" IN ('N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'))),
	CONSTRAINT "appointments_met_outcome" CHECK("appointments"."status" <> 'MET' OR ("appointments"."stage_after" IS NOT NULL AND "appointments"."next_step" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`re_id` text NOT NULL,
	`birth_date` text,
	`gender` text,
	`stage` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`re_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "customers_gender" CHECK("customers"."gender" IN ('MALE', 'FEMALE')),
	CONSTRAINT "customers_stage" CHECK("customers"."stage" IN ('N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_code_unique` ON `customers` (`code`);--> statement-breakpoint
CREATE TABLE `policies` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`re_id` text NOT NULL,
	`submitted_date` text NOT NULL,
	`submitted_fyp` integer NOT NULL,
	`issued_date` text,
	`issued_fyp` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`re_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "policies_submitted_fyp" CHECK("policies"."submitted_fyp" > 0),
	CONSTRAINT "policies_issued_pair" CHECK(("policies"."issued_date" IS NULL) = ("policies"."issued_fyp" IS NULL)),
	CONSTRAINT "policies_issued" CHECK("policies"."issued_date" IS NULL OR ("policies"."issued_fyp" > 0 AND "policies"."issued_date" >= "policies"."submitted_date"))
);
--> statement-breakpoint
CREATE TABLE `stage_transitions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`from_stage` text,
	`to_stage` text NOT NULL,
	`date` text NOT NULL,
	`appointment_id` text,
	`created_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "stage_transitions_to" CHECK("stage_transitions"."to_stage" IN ('N4', 'N3', 'N2', 'N1', 'ON_HOLD', 'LOST'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stage_transitions_customer_seq` ON `stage_transitions` (`customer_id`,`seq`);