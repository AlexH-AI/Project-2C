-- Custom SQL migration file, put your code below! --
-- The stamp of a case size dự kiến already there (golden D mục 4 điểm 3, D1): only a meeting's
-- outcome could write one before 0020, so its last change is the appointment's `updated_at`. One
-- stamp for every number and only for those, as the commands keep it; the rest stays empty.
UPDATE `appointments` SET `expected_case_size_at` = `updated_at`
WHERE `expected_case_size` IS NOT NULL;
