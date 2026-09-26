/**
 * Drizzle schema (spec `docs/design/phase-3-du-lieu.md` §2–3). Migrations are generated from this
 * file with `pnpm db:generate`; never edit a generated migration by hand.
 */
import { PERSON_ROLES } from '@p2c/domain';
import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
};

export const teams = sqliteTable(
  'teams',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('teams_active_name')
      .on(t.name)
      .where(sql`${t.deletedAt} IS NULL`),
  ],
);

const roleList = sql.raw(PERSON_ROLES.map((r) => `'${r}'`).join(', '));

export const people = sqliteTable(
  'people',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    role: text('role', { enum: PERSON_ROLES }).notNull(),
    teamId: text('team_id').references(() => teams.id),
    ...timestamps,
  },
  (t) => [
    check('people_role', sql`${t.role} IN (${roleList})`),
    check('people_team_required', sql`${t.role} NOT IN ('RE', 'TL') OR ${t.teamId} IS NOT NULL`),
  ],
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const schemaMigrations = sqliteTable('schema_migrations', {
  id: integer('id').primaryKey(),
  appliedAt: text('applied_at').notNull(),
});
