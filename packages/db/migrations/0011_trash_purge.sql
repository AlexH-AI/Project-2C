-- Custom SQL migration file, put your code below! --
-- Dọn sạch Thùng rác deletes a soft-deleted customer for good, with its KYC notes, facts and AI
-- analyses (spec Phase 6 TR-11, ADR-0008 phụ lục 19/10/2026): their delete triggers let those rows
-- go, and only those. Every other delete is refused as 0003 and 0008 made it; no update trigger
-- changes, so a row of a deleted customer is not edited either.
DROP TRIGGER `kyc_notes_no_delete`;
--> statement-breakpoint
CREATE TRIGGER `kyc_notes_no_delete` BEFORE DELETE ON `kyc_notes`
WHEN NOT EXISTS (SELECT 1 FROM `customers` WHERE `id` = OLD.`customer_id` AND `deleted_at` IS NOT NULL)
BEGIN
	SELECT RAISE(ABORT, 'kyc_notes is append-only');
END;
--> statement-breakpoint
DROP TRIGGER `kyc_facts_no_delete`;
--> statement-breakpoint
CREATE TRIGGER `kyc_facts_no_delete` BEFORE DELETE ON `kyc_facts`
WHEN NOT EXISTS (SELECT 1 FROM `customers` WHERE `id` = OLD.`customer_id` AND `deleted_at` IS NOT NULL)
BEGIN
	SELECT RAISE(ABORT, 'kyc_facts is append-only apart from its status');
END;
--> statement-breakpoint
DROP TRIGGER `ai_analyses_no_delete`;
--> statement-breakpoint
CREATE TRIGGER `ai_analyses_no_delete` BEFORE DELETE ON `ai_analyses`
WHEN NOT EXISTS (SELECT 1 FROM `customers` WHERE `id` = OLD.`customer_id` AND `deleted_at` IS NOT NULL)
BEGIN
	SELECT RAISE(ABORT, 'ai_analyses is append-only');
END;
