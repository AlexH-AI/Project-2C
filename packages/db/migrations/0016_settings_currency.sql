-- Custom SQL migration file, put your code below! --
-- The currency of the data (ADR-0018 §2, §7): every database and backup made before this key was
-- VND. A new key for every old database, not a fix of wrong data: the approved exception to "the
-- data is simulated" (Owner 12/11/2026, Q12). A new database gets it too; the seed writes its own.
INSERT INTO `settings` (`key`, `value_json`, `updated_at`)
SELECT 'currency', '"VND"', strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'currency');
