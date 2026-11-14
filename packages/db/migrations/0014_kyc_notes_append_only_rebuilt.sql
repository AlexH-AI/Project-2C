-- Custom SQL migration file, put your code below! --
-- 0013 rebuilt `kyc_notes` to store RM in place of RE (A2, spec Phase 6 phản hồi §3.3), and dropping
-- the old table dropped its triggers: the notes are never edited, nor deleted but by the purge of
-- Thùng rác, as 0003 and 0011 made them (ADR-0008).
CREATE TRIGGER `kyc_notes_no_update` BEFORE UPDATE ON `kyc_notes`
BEGIN
	SELECT RAISE(ABORT, 'kyc_notes is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `kyc_notes_no_delete` BEFORE DELETE ON `kyc_notes`
WHEN NOT EXISTS (SELECT 1 FROM `customers` WHERE `id` = OLD.`customer_id` AND `deleted_at` IS NOT NULL)
BEGIN
	SELECT RAISE(ABORT, 'kyc_notes is append-only');
END;
