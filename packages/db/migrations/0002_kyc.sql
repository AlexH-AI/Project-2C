CREATE TABLE `kyc_facts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`field` text NOT NULL,
	`value_json` text NOT NULL,
	`note_id` text NOT NULL,
	`confirmed_date` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`note_id`) REFERENCES `kyc_notes`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "kyc_facts_field" CHECK("kyc_facts"."field" IN ('birthYear', 'gender', 'residence', 'maritalStatus', 'childrenCount', 'dependents', 'occupation', 'annualIncome', 'incomeSources', 'totalAssets', 'assetAllocation', 'liabilities', 'primaryGoal', 'goalHorizon', 'otherGoals', 'riskProfile', 'investmentExperience', 'hasProtection', 'protectionDetails', 'mainConcern', 'otherConcerns')),
	CONSTRAINT "kyc_facts_status" CHECK("kyc_facts"."status" IN ('active', 'superseded', 'conflict'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kyc_facts_customer_seq` ON `kyc_facts` (`customer_id`,`seq`);--> statement-breakpoint
CREATE TABLE `kyc_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`text` text NOT NULL,
	`created_date` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "kyc_notes_source" CHECK("kyc_notes"."source" IN ('RE', 'SYSTEM'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kyc_notes_customer_seq` ON `kyc_notes` (`customer_id`,`seq`);--> statement-breakpoint
CREATE TABLE `kyc_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`hash` text NOT NULL,
	`date` text NOT NULL,
	`material` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "kyc_versions_material" CHECK("kyc_versions"."material" IN (0, 1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kyc_versions_customer_seq` ON `kyc_versions` (`customer_id`,`seq`);