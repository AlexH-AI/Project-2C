import { KYC_CATEGORY_LABELS, KYC_FIELD_LABELS } from '@p2c/ai';
import { DB_ERROR_CODES, DbError } from '@p2c/db';
import { KYC_CATEGORIES, KYC_FIELDS, type KycField } from '@p2c/domain';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COUNT_SLOTS, errorMessage, fillSlots, formatMessage, joinParts, t, tableMore } from '.';
import { vi } from './vi';

/**
 * Slots shown as given: text, or a number that is no count (a year, a version, a month). Only this
 * test reads them, to have each new slot sorted into one list or the other (DR6-66).
 */
const PLAIN_SLOTS: ReadonlySet<string> = new Set([
  'age',
  'amount',
  'code',
  'compact',
  'currency',
  'customer',
  'date',
  'defaults',
  'diff',
  'exported',
  'field',
  'fields',
  'file',
  'from',
  'fyp',
  'gate',
  'group',
  'issued',
  'label',
  'limitMb',
  'mark',
  'message',
  'month',
  'model',
  'models',
  'name',
  'next',
  'note',
  'now',
  'number',
  'parts',
  'period',
  'plan',
  'provider',
  'quarter',
  'range',
  'read',
  'reasoning',
  'record',
  'role',
  'roles',
  'scope',
  'size',
  'stage',
  'status',
  'step',
  'submitted',
  'supported',
  'table',
  'team',
  'time',
  'to',
  'today',
  'trigger',
  'value',
  'values',
  'version',
  'weekday',
  'when',
  'where',
  'word',
  'year',
]);

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

  // R2-03: "4,528 lịch" next to "1,234 lịch", however the count was passed (ADR-0018 §4).
  it('groups the thousands of a count', () => {
    expect(t('appointments.summary', { total: 4528, met: 1234 })).toBe('4,528 lịch · 1,234 đã gặp');
    expect(t('customers.summary', { open: 12045, closed: 0 })).toBe(
      '12,045 KH đang mở · 0 đã đóng',
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

// ADR-0018 §9: an English message with a count has a form for 1 and one for any other number.
describe('formatMessage', () => {
  const customers = { one: '{count} customer', other: '{count} customers' };

  it('picks the form by the count: one for 1, other for any other number', () => {
    expect(formatMessage(customers, { count: 1 })).toBe('1 customer');
    expect(formatMessage(customers, { count: 2 })).toBe('2 customers');
    expect(formatMessage(customers, { count: 0 })).toBe('0 customers');
    expect(formatMessage(customers, { count: 1204 })).toBe('1,204 customers');
  });

  it('goes by the slot that holds a count, whatever its name', () => {
    const open = {
      one: '{open} open customer in {year}',
      other: '{open} open customers in {year}',
    };
    expect(formatMessage(open, { year: 1, open: 3 })).toBe('3 open customers in 1');
    expect(formatMessage(open, { year: 2026, open: 1 })).toBe('1 open customer in 2026');
  });

  it('reads the other form without a count to go by', () => {
    expect(formatMessage(customers)).toBe('{count} customers');
    expect(formatMessage(customers, { total: 1 })).toBe('{count} customers');
    expect(formatMessage({ one: 'Year {year}', other: 'Years {year}' }, { year: 1 })).toBe(
      'Years 1',
    );
  });

  // A count passed as text is shown as passed and never picks `one` ('1' is not 1): "1 tokens".
  // So every caller passes the number and `fillSlots` writes it (review note of T-437, L162).
  it('gets the number of every count from its callers, never a formatted text', () => {
    const src = new URL('../', import.meta.url);
    const formatted = new RegExp(`\\b(?:${[...COUNT_SLOTS].join('|')}): *format\\w*\\(`);
    const callers = (readdirSync(src, { recursive: true }) as string[])
      .map((file) => file.replaceAll('\\', '/'))
      .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
      .filter((file) => formatted.test(readFileSync(new URL(file, src), 'utf8')));
    expect(callers).toEqual([]);
  });

  it('fills the slots of a message with one form', () => {
    expect(formatMessage('Anchored on {date}.', { date: '15/09/2026' })).toBe(
      'Anchored on 15/09/2026.',
    );
    expect(formatMessage('Anchored on {date}.')).toBe('Anchored on {date}.');
  });
});

describe('the save warning', () => {
  // DR-52: a SQLite tool holding the file is the usual reason a save fails.
  it('names a program holding the file as the likely cause', () => {
    expect(t('storage.saveFailed')).toContain('file có thể đang mở trong chương trình khác');
  });
});

// The labels sent to the AI and written by the seed are the ones on screen (DR5-18).
describe('the KYC labels of @p2c/ai', () => {
  it('are the labels of the app, hạng mục and trường alike', () => {
    expect(KYC_CATEGORY_LABELS).toEqual(
      Object.fromEntries(KYC_CATEGORIES.map((code) => [code, vi[`kycCategory.${code}`]])),
    );
    expect(KYC_FIELD_LABELS).toEqual(
      Object.fromEntries(
        (Object.keys(KYC_FIELDS) as KycField[]).map((field) => [field, vi[`kycField.${field}`]]),
      ),
    );
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

  // DR-64: the command knows the day it was blocked by; the dialog does not work it out again.
  it("fills in the error's own parameters, which win over the caller's", () => {
    const error = new DbError('TRANSITION_BEFORE_LATEST', { date: '23/01/2026' });
    expect(errorMessage(error)).toBe('Ngày chuyển trước lần đổi nhóm gần nhất (23/01/2026).');
    expect(errorMessage(error, { date: '25/08/2026' })).toBe(
      'Ngày chuyển trước lần đổi nhóm gần nhất (23/01/2026).',
    );
  });

  // Review of PR 1167: a met meeting after today, after the machine clock was set back (T-399).
  it('tells to check the machine clock when the meeting in the way is after today', () => {
    const blocked = (params: { date: string; afterToday?: number }) =>
      errorMessage(new DbError('TRANSITION_BEFORE_MEETING', params));

    expect(blocked({ date: '08/11/2026', afterToday: 1 })).toBe(
      'Đã ghi cuộc gặp Đã gặp ngày 08/11/2026, sau hôm nay của máy: không đổi nhóm vào ngày trước 08/11/2026. Kiểm lại ngày giờ của máy: đồng hồ có thể đã bị chỉnh lùi.',
    );
    expect(blocked({ date: '12/01/2026' })).toBe(
      'Đã ghi cuộc gặp Đã gặp ngày 12/01/2026, cuộc gặp đó ghi nhóm của KH ngày ấy: không đổi nhóm vào ngày trước 12/01/2026.',
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

describe('tableMore', () => {
  it('words the foot of a big table as the mockup does, thousands grouped', () => {
    const appointments = tableMore('appointments');
    expect(appointments.shown(100, 7071)).toBe('Đang hiện 100 / 7,071 lịch');
    expect(appointments.more(71)).toBe('Hiện thêm 71 lịch');
    expect(appointments.all(7071)).toBe('Đã hiện hết 7,071 lịch');
    expect(tableMore('customers').more(100)).toBe('Hiện thêm 100 khách hàng');
    expect(tableMore('people').all(120)).toBe('Đã hiện hết 120 người');
  });
});
