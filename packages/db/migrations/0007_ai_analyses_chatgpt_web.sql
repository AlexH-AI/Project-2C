PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`seq` integer NOT NULL,
	`kyc_version_id` text NOT NULL,
	`mode` text NOT NULL,
	`gate_state` text NOT NULL,
	`status` text NOT NULL,
	`provider` text NOT NULL,
	`model` text,
	`reasoning` text,
	`prompt_version` text NOT NULL,
	`attempts` integer NOT NULL,
	`input_json` text NOT NULL,
	`output_json` text,
	`raw_output` text,
	`validator_json` text NOT NULL,
	`prompt_tokens` integer,
	`completion_tokens` integer,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kyc_version_id`) REFERENCES `kyc_versions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ai_analyses_mode_gate" CHECK(("__new_ai_analyses"."mode" = 'analysis' AND "__new_ai_analyses"."gate_state" = 'PAIN_POINT_ANALYSIS') OR ("__new_ai_analyses"."mode" = 'discovery' AND "__new_ai_analyses"."gate_state" = 'PROFILE_DISCOVERY')),
	CONSTRAINT "ai_analyses_status" CHECK("__new_ai_analyses"."status" IN ('ACCEPTED', 'REJECTED')),
	CONSTRAINT "ai_analyses_provider" CHECK("__new_ai_analyses"."provider" IN ('MOCK', 'OPENCODE_GO', 'CHATGPT_WEB')),
	CONSTRAINT "ai_analyses_reasoning" CHECK("__new_ai_analyses"."reasoning" IS NULL OR "__new_ai_analyses"."reasoning" IN ('DEFAULT', 'LOW', 'MEDIUM', 'HIGH')),
	CONSTRAINT "ai_analyses_no_model" CHECK("__new_ai_analyses"."provider" NOT IN ('MOCK', 'CHATGPT_WEB') OR ("__new_ai_analyses"."model" IS NULL AND "__new_ai_analyses"."reasoning" IS NULL AND "__new_ai_analyses"."prompt_tokens" IS NULL AND "__new_ai_analyses"."completion_tokens" IS NULL)),
	CONSTRAINT "ai_analyses_model" CHECK("__new_ai_analyses"."provider" IN ('MOCK', 'CHATGPT_WEB') OR ("__new_ai_analyses"."model" IS NOT NULL AND "__new_ai_analyses"."reasoning" IS NOT NULL)),
	CONSTRAINT "ai_analyses_attempts" CHECK("__new_ai_analyses"."attempts" IN (1, 2)),
	CONSTRAINT "ai_analyses_tokens" CHECK(("__new_ai_analyses"."prompt_tokens" IS NULL OR "__new_ai_analyses"."prompt_tokens" >= 0) AND ("__new_ai_analyses"."completion_tokens" IS NULL OR "__new_ai_analyses"."completion_tokens" >= 0)),
	CONSTRAINT "ai_analyses_outcome" CHECK(("__new_ai_analyses"."status" = 'ACCEPTED' AND "__new_ai_analyses"."output_json" IS NOT NULL AND "__new_ai_analyses"."raw_output" IS NULL) OR ("__new_ai_analyses"."status" = 'REJECTED' AND coalesce(length("__new_ai_analyses"."raw_output"), 0) BETWEEN 1 AND 20000))
);
--> statement-breakpoint
INSERT INTO `__new_ai_analyses`("id", "customer_id", "seq", "kyc_version_id", "mode", "gate_state", "status", "provider", "model", "reasoning", "prompt_version", "attempts", "input_json", "output_json", "raw_output", "validator_json", "prompt_tokens", "completion_tokens", "date", "created_at") SELECT "id", "customer_id", "seq", "kyc_version_id", "mode", "gate_state", "status", "provider", "model", "reasoning", "prompt_version", "attempts", "input_json", "output_json", "raw_output", "validator_json", "prompt_tokens", "completion_tokens", "date", "created_at" FROM `ai_analyses`;--> statement-breakpoint
DROP TABLE `ai_analyses`;--> statement-breakpoint
ALTER TABLE `__new_ai_analyses` RENAME TO `ai_analyses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ai_analyses_customer_seq` ON `ai_analyses` (`customer_id`,`seq`);