-- Custom SQL migration file, put your code below! --
-- 0007 rebuilt `ai_analyses` to let ChatGPT web in (spec Phase 5 §7.1, P7), and dropping the old
-- table dropped its triggers: the history is never edited or deleted, as 0006 made it.
CREATE TRIGGER `ai_analyses_no_update` BEFORE UPDATE ON `ai_analyses`
BEGIN
	SELECT RAISE(ABORT, 'ai_analyses is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `ai_analyses_no_delete` BEFORE DELETE ON `ai_analyses`
BEGIN
	SELECT RAISE(ABORT, 'ai_analyses is append-only');
END;
