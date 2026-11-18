import type { Person, Team } from '@p2c/domain';
import { describe, expect, it } from 'vitest';
import { viewingTrail } from './screen-bar';

const teams: readonly Team[] = [
  { id: 'team-1', name: 'Sao Mai' },
  { id: 'team-2', name: 'Bình Minh' },
];
const people: readonly Person[] = [
  { id: 'rm-1', name: 'Đỗ Khánh Linh', role: 'RM', teamId: 'team-1' },
  { id: 'rm-2', name: 'Hoàng Nam', role: 'RM', teamId: 'team-9' },
];

describe('viewingTrail (mockup app-shell.html #toolbar: "team → RM đang xem")', () => {
  it('says everyone is shown', () => {
    expect(viewingTrail({ kind: 'all' }, teams, people)).toBe('Toàn bộ');
  });

  it('names the whole team', () => {
    expect(viewingTrail({ kind: 'team', teamId: 'team-2' }, teams, people)).toBe(
      'Cả team Bình Minh',
    );
  });

  it('names the team, then its RM', () => {
    expect(viewingTrail({ kind: 'rm', rmId: 'rm-1' }, teams, people)).toBe(
      'Team Sao Mai → Đỗ Khánh Linh',
    );
  });

  it('names an RM alone when the team is not there, and nothing for an RM not there', () => {
    expect(viewingTrail({ kind: 'rm', rmId: 'rm-2' }, teams, people)).toBe('Hoàng Nam');
    expect(viewingTrail({ kind: 'rm', rmId: 'rm-0' }, teams, people)).toBe('');
  });
});
