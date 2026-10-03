import { DB_ERROR_CODES, DbError } from '@p2c/db';
import { describe, expect, it } from 'vitest';
import { errorMessage, t } from '.';
import { vi } from './vi';

describe('t', () => {
  it('fills in the {name} slots and leaves unknown ones', () => {
    expect(t('settings.demo.done', { date: '15/09/2026' })).toBe(
      'Đã nạp lại dữ liệu giả lập, neo ở ngày 15/09/2026.',
    );
    expect(t('settings.demo.done')).toBe('Đã nạp lại dữ liệu giả lập, neo ở ngày {date}.');
  });
});

describe('errorMessage', () => {
  it('shows a command error by its code', () => {
    expect(errorMessage(new DbError('TEAM_HAS_MEMBERS'))).toBe(
      'Team còn nhân sự: chuyển hoặc xóa hết nhân sự trước khi xóa team.',
    );
    expect(errorMessage(new DbError('NAME_REQUIRED'))).toBe('Chưa nhập tên.');
  });

  it('fills in the parameters', () => {
    expect(errorMessage(new DbError('TEAM_NAME_TAKEN'), { name: 'Sao Mai' })).toBe(
      'Đã có team "Sao Mai".',
    );
  });

  // F-12: a code the UI can show without its own text reads as the general error.
  it('has a message for every code a command can reject with in the UI', () => {
    // Shown by their own screens, never through `errorMessage`: the seed runs on an empty
    // database only, and opening or importing a file has its own messages (startup, backup).
    const ownMessage = [
      'SEED_DATABASE_NOT_EMPTY',
      'SCHEMA_TOO_NEW',
      'BACKUP_INVALID',
      'BACKUP_TOO_LARGE',
    ];

    const missing = DB_ERROR_CODES.filter(
      (code) => !ownMessage.includes(code) && !Object.hasOwn(vi, `error.${code}`),
    );
    expect(missing).toEqual([]);
  });

  it('falls back to a general message for a code without text, or anything else', () => {
    const general = 'Chưa lưu được thay đổi. Dữ liệu không bị đổi.';
    expect(errorMessage(new DbError('SEED_DATABASE_NOT_EMPTY'))).toBe(general);
    expect(errorMessage(new Error('boom'))).toBe(general);
  });
});
