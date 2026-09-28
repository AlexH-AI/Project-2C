import { DbError } from '@p2c/db';
import { describe, expect, it } from 'vitest';
import { errorMessage, t } from '.';

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

  it('falls back to a general message for a code without text, or anything else', () => {
    const general = 'Chưa lưu được thay đổi. Dữ liệu không bị đổi.';
    expect(errorMessage(new DbError('SEED_DATABASE_NOT_EMPTY'))).toBe(general);
    expect(errorMessage(new Error('boom'))).toBe(general);
  });
});
