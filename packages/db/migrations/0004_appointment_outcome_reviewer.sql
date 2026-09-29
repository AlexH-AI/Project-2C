-- Written by hand over drizzle-kit's output, which rebuilt `appointments` to add the table-level
-- CHECK: its copy step read `outcome_reviewer_id` from the old table, which has no such column, and
-- its `PRAGMA foreign_keys=OFF` is a no-op inside the migration transaction. SQLite adds the column
-- with the same CHECK and foreign key in place, keeping every row (spec §3.5, D9; review #80).
-- The snapshot is drizzle-kit's, so the next `db:generate` sees the schema as declared.
ALTER TABLE `appointments` ADD `outcome_reviewer_id` text REFERENCES `people`(`id`) CONSTRAINT `appointments_outcome_reviewer` CHECK(`status` = 'MET' OR `outcome_reviewer_id` IS NULL);
