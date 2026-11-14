-- A3 (spec Phase 6 phản hồi §3.3): the column of the RM, re_id, becomes rm_id in place. drizzle-kit
-- generated a rebuild of the three tables instead (copy, drop, rename), which fails on the triggers
-- of 0011 and copies a column the old tables do not have: its own rename statement replaces it.
ALTER TABLE `appointments` RENAME COLUMN "re_id" TO "rm_id";--> statement-breakpoint
ALTER TABLE `customers` RENAME COLUMN "re_id" TO "rm_id";--> statement-breakpoint
ALTER TABLE `policies` RENAME COLUMN "re_id" TO "rm_id";
