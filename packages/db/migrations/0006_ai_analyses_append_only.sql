-- Custom SQL migration file, put your code below! --
-- The AI analysis history is never edited or deleted (spec Phase 5 §7.1, like kyc_notes).
CREATE TRIGGER `ai_analyses_no_update` BEFORE UPDATE ON `ai_analyses`
BEGIN
	SELECT RAISE(ABORT, 'ai_analyses is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `ai_analyses_no_delete` BEFORE DELETE ON `ai_analyses`
BEGIN
	SELECT RAISE(ABORT, 'ai_analyses is append-only');
END;
