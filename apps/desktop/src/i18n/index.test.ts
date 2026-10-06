import { DB_ERROR_CODES, DbError } from '@p2c/db';
import { describe, expect, it } from 'vitest';
import { COUNT_SLOTS, PLAIN_SLOTS, errorMessage, fillSlots, joinParts, t } from '.';
import { vi } from './vi';

describe('t', () => {
  it('fills in the {name} slots and leaves unknown ones', () => {
    expect(t('settings.demo.done', { date: '15/09/2026' })).toBe(
      'Đã nạp lại dữ liệu giả lập, neo ở ngày 15/09/2026.',
    );
    expect(t('settings.demo.done')).toBe('Đã nạp lại dữ liệu giả lập, neo ở ngày {date}.');
  });

  // F-19: only the params' own names fill a slot, never what every object inherits.
  it('leaves a slot whose name the params only inherit', () => {
    expect(t('settings.demo.done', { hasOwnProperty: 1 })).toBe(
      'Đã nạp lại dữ liệu giả lập, neo ở ngày {date}.',
    );
    expect(fillSlots('{toString} · {constructor} · {date}', { date: '15/09/2026' })).toBe(
      '{toString} · {constructor} · 15/09/2026',
    );
  });

  // R2-03: "4.528 lịch" next to "1.234 lịch", however the count was passed.
  it('groups the thousands of a count', () => {
    expect(t('appointments.summary', { total: 4528, met: 1234 })).toBe('4.528 lịch · 1.234 đã gặp');
    expect(t('customers.summary', { open: 12045, closed: 0 })).toBe(
      '12.045 KH đang mở · 0 đã đóng',
    );
    expect(t('appointments.year', { year: 2026 })).toBe('Lịch năm 2026');
  });

  it('knows whether each slot holds a count', () => {
    const slots = new Set(
      [
        ...Object.values(vi)
          .join(' ')
          .matchAll(/\{(\w+)\}/g),
      ].map((m) => String(m[1])),
    );
    const unclassified = [...slots].filter(
      (slot) => !COUNT_SLOTS.has(slot) && !PLAIN_SLOTS.has(slot),
    );
    expect(unclassified).toEqual([]);
  });
});

describe('the save warning', () => {
  // DR-52: a SQLite tool holding the file is the usual reason a save fails.
  it('names a program holding the file as the likely cause', () => {
    expect(t('storage.saveFailed')).toContain('file có thể đang mở trong chương trình khác');
  });
});

describe('joinParts', () => {
  it('joins with a dot, or an arrow', () => {
    expect(joinParts(['Nữ', '1991'])).toBe('Nữ · 1991');
    expect(joinParts(['N2', 'N1'], 'arrow')).toBe('N2 → N1');
    expect(joinParts([])).toBe('');
  });

  it('leaves out the parts not known', () => {
    expect(joinParts(['Hẹn lại', null, '', undefined, false, 'Gặp cùng TL'])).toBe(
      'Hẹn lại · Gặp cùng TL',
    );
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
