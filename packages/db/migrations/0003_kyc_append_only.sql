-- Custom SQL migration file, put your code below! --
-- KYC notes are never edited or deleted; KYC facts are never deleted and only their status changes
-- (ADR-0008, spec §3.8–3.9, D4).
CREATE TRIGGER `kyc_notes_no_update` BEFORE UPDATE ON `kyc_notes`
BEGIN
	SELECT RAISE(ABORT, 'kyc_notes is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `kyc_notes_no_delete` BEFORE DELETE ON `kyc_notes`
BEGIN
	SELECT RAISE(ABORT, 'kyc_notes is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `kyc_facts_status_only` BEFORE UPDATE OF `id`, `customer_id`, `seq`, `field`, `value_json`, `note_id`, `confirmed_date`, `created_at` ON `kyc_facts`
BEGIN
	SELECT RAISE(ABORT, 'kyc_facts is append-only apart from its status');
END;
--> statement-breakpoint
CREATE TRIGGER `kyc_facts_no_delete` BEFORE DELETE ON `kyc_facts`
BEGIN
	SELECT RAISE(ABORT, 'kyc_facts is append-only apart from its status');
END;
