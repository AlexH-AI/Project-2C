import { DbError, type TrashBlock, type TrashRef, type TrashRow } from '@p2c/db';
import { formatDate, formatLocalDateTime, formatVnd, type CustomerStage } from '@p2c/domain';
import type { DataTableMoreLabels } from '@p2c/ui';
import { errorMessage, joinParts, t } from '../i18n';

/** The kinds of the filter of Thùng rác, in the order of mockup 11a. */
export const TRASH_FILTERS = [
  'all',
  'customer',
  'appointment',
  'policy',
  'person',
  'team',
] as const;

export type TrashFilter = (typeof TRASH_FILTERS)[number];

export function trashCounts(rows: readonly TrashRow[]): Record<TrashFilter, number> {
  const counts = Object.fromEntries(TRASH_FILTERS.map((kind) => [kind, 0])) as Record<
    TrashFilter,
    number
  >;
  for (const row of rows) counts[row.kind] += 1;
  counts.all = rows.length;
  return counts;
}

/** The foot of a trash of over a hundred records (DR-03). */
export const TRASH_MORE: DataTableMoreLabels = {
  shown: (count, total) => t('trash.more.shown', { count, total }),
  more: (count) => t('trash.more.more', { count }),
  all: (total) => t('trash.more.all', { total }),
};

const plain = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');

/** The name the search box looks in: its own, or its customer's for an appointment or a policy. */
function searchedName(row: TrashRow): string {
  return row.kind === 'appointment' || row.kind === 'policy'
    ? (row.owner.customer?.name ?? '')
    : row.name;
}

/** The rows of the kind whose name contains the text (accents and case ignored), in trash order. */
export function filterTrash(
  rows: readonly TrashRow[],
  filter: TrashFilter,
  query: string,
): readonly TrashRow[] {
  const needle = plain(query.trim());
  return rows.filter(
    (row) =>
      (filter === 'all' || row.kind === filter) &&
      (needle === '' || plain(searchedName(row)).includes(needle)),
  );
}

const stage = (value: CustomerStage) => t(`stage.${value}`);

/** The first line of "Bản ghi" (spec Phase 6 §4.2); a customer's stage and a policy's status are badges. */
export function recordTitle(row: TrashRow): string {
  switch (row.kind) {
    case 'appointment': {
      const date = formatDate(row.date);
      const when = row.time === null ? date : t('trash.appointment.when', { date, time: row.time });
      return joinParts([when, t(`appointmentStatus.${row.status}`)]);
    }
    case 'policy':
      return t('trash.policy.title', {
        date: formatDate(row.submittedDate),
        fyp: formatVnd(row.submittedFyp),
      });
    default:
      return row.name;
  }
}

/** The line under it: what comes back with a customer, the stage change of a met appointment. */
export function recordDetail(row: TrashRow): string | null {
  switch (row.kind) {
    case 'customer': {
      const { effect } = row;
      return effect.kind === 'customer'
        ? t('trash.customer.with', {
            appointments: effect.appointments,
            policies: effect.policies,
            count: effect.kycNotes,
          })
        : null;
    }
    case 'appointment':
      return appointmentDetail(row);
    case 'person':
      return row.role;
    case 'team':
      return t('trash.team.members');
    case 'policy':
      return null;
  }
}

function appointmentDetail(row: Extract<TrashRow, { kind: 'appointment' }>): string | null {
  // A blocked restore moves nothing: the change counted from today's stage would mislead.
  if (row.blocked) {
    return row.status === 'MET' && row.stageAfter !== null
      ? t('trash.appointment.stageAfter', { stage: stage(row.stageAfter) })
      : null;
  }
  const { effect } = row;
  if (effect.kind === 'stageKept') {
    return t('trash.appointment.kept', { stage: stage(effect.stage) });
  }
  if (effect.kind !== 'stageChange') return null;
  return joinParts([
    joinParts([stage(effect.from), stage(effect.to)], 'arrow'),
    effect.rf && t('trash.appointment.rf'),
  ]);
}

export interface OwnerPart {
  readonly text: string;
  /** Deleted too: "(đã xóa)" follows it. */
  readonly deleted: boolean;
}

const part = (ref: TrashRef, text: string): OwnerPart => ({ text, deleted: ref.deleted });

/** "Thuộc": customer and RE of an appointment or a policy, RE and team of a customer, a team. */
export function ownerParts(row: TrashRow): OwnerPart[] {
  const { customer, re, team } = row.owner;
  const parts: OwnerPart[] = [];
  if (customer) parts.push(part(customer, t('trash.owner.customer', { name: customer.name })));
  if (re) parts.push(part(re, t('trash.owner.re', { name: re.name })));
  // After an RE it is the RE's team (mockup 11a "RE Đỗ Khánh Linh · Sao Mai").
  if (team) parts.push(part(team, re ? team.name : t('trash.owner.team', { name: team.name })));
  return parts;
}

export function deletedAtText(row: TrashRow): string {
  return formatLocalDateTime(new Date(row.deletedAt));
}

/**
 * Why the record cannot be restored, one line naming the record in the way (mockup 11d), from the
 * error its `restore…` command throws; the restore dialog (T-211) shows the same line when the
 * command refuses. A reason without a sentence of its own reads as the command's message.
 */
export function blockedReason(row: TrashRow, block: TrashBlock): string {
  return reasonSentence(row, block) ?? errorMessage(new DbError(block.code, block.params));
}

function reasonSentence(row: TrashRow, { code, params = {} }: TrashBlock): string | null {
  const { as, field, from, to } = params;
  if (code === 'PERSON_NOT_FOUND') {
    return as === 're' || as === 'coordinator' || as === 'reviewer'
      ? t(`trash.blocked.${as}`, params)
      : null;
  }
  if (code === 'DATE_IN_FUTURE') {
    return field === 'submitted' || field === 'issued' ? t(`trash.blocked.${field}`, params) : null;
  }
  if (code === 'INVALID_TRANSITION') {
    return typeof from === 'string' && typeof to === 'string'
      ? t('trash.blocked.INVALID_TRANSITION', {
          from: stage(from as CustomerStage),
          to: stage(to as CustomerStage),
        })
      : null;
  }
  if (code === 'TEAM_HAS_LEAD') {
    const team = row.owner.team;
    return team && 'name' in params
      ? t('trash.blocked.TEAM_HAS_LEAD', { ...params, team: team.name })
      : null;
  }
  if (code === 'TRANSITION_BEFORE_LATEST' || code === 'OUTCOME_IN_FUTURE') {
    return 'date' in params ? t(`trash.blocked.${code}`, params) : null;
  }
  if (
    code === 'RE_REQUIRED' ||
    code === 'CUSTOMER_NOT_FOUND' ||
    code === 'INVALID_REVIEWER' ||
    code === 'INVALID_COORDINATOR' ||
    code === 'TEAM_NOT_FOUND' ||
    code === 'TEAM_NAME_TAKEN'
  ) {
    return 'name' in params ? t(`trash.blocked.${code}`, params) : null;
  }
  return null;
}
