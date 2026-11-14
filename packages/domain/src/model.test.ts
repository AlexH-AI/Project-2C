import { describe, expect, it } from 'vitest';
import { isRm, PERSON_ROLES, RM_ROLE, ROLES_WITH_TEAM } from './model';

describe('isRm', () => {
  it('is true of the RM only, the one role with metrics (ADR-0007)', () => {
    expect(PERSON_ROLES.filter((role) => isRm({ role }))).toEqual([RM_ROLE]);
  });

  it('is the role every customer, appointment and policy belongs to, which has a team', () => {
    expect(RM_ROLE).toBe('RM');
    expect(ROLES_WITH_TEAM).toContain(RM_ROLE);
  });
});
