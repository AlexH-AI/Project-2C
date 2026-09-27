/**
 * Simulated data (spec §7, D8): 3 teams of 1 TL + 10 RE with a shared IS, BD and BDM; 12 months of
 * customers, appointments and policies up to the anchor day, and 2-4 weeks of appointments after
 * it. Everything goes through the commands (spec §4), day by day, in one transaction with seeded
 * sources — the same anchor day and seed give the same data on any machine.
 */
import {
  calendarDate,
  isPipelineStage,
  KYC_FIELDS,
  PIPELINE_STAGES,
  type CalendarDate,
  type CustomerStage,
  type KycField,
  type KycValue,
  type Person,
  type Vnd,
} from '@p2c/domain';
import { recordMeetingOutcome, rescheduleAppointment, scheduleAppointment } from './appointments';
import {
  changeStageManually,
  createCustomer,
  updateCustomerProfile,
  type BirthDate,
  type Gender,
} from './customers';
import type { Database } from './database';
import { DbError } from './errors';
import type { RandomFill } from './ids';
import { addKycNote, confirmKycFact, markKycConflict, resolveKycConflict } from './kyc';
import { issuePolicy, submitPolicy } from './policies';
import {
  APPOINTMENT_TIMES,
  BIRTH_DATE_KINDS,
  CASE_SIZES_MILLION,
  FAMILY_NAMES,
  GIVEN_NAMES,
  KYC_TOPICS,
  KYC_VALUES,
  MEETING_NOTES,
  MIDDLE_NAMES,
  MOVES,
  NEXT_STEPS,
  OUTCOMES,
  STARTING_STAGES,
  TEAM_NAMES,
  TRIGGER_NOTES,
  TRIGGERS,
  type Weighted,
} from './seed-data';
import { createPerson, createTeam, listPeople, listTeams } from './team';

export interface SeedOptions {
  /** The day the data leads up to: history before it, only scheduled appointments from it on. */
  readonly anchorDate: CalendarDate;
  readonly seed: number;
}

const DAY_MS = 86_400_000;
const HISTORY_DAYS = 365;
const FUTURE_DAYS = 24;
const RES_PER_TEAM = 10;
const CUSTOMERS_PER_RE = 40;
/** Customers each RE already has when the history starts; the rest arrive over the year. */
const STARTING_CUSTOMERS = 10;
const MILLION = 1_000_000;
/** Chance that a meeting leaving the customer in N1 ends with a submitted policy. */
const POLICY_CHANCE = 0.8;
/** KYC notes written by the RE per customer: one at the first contact, more after meetings. */
const MAX_KYC_NOTES = 5;
const KYC_NOTE_CHANCE = 0.4;
/** Chance per met meeting that a customer who gave no birth date gives it. */
const BIRTH_DATE_CHANCE = 0.3;
/** Of the notes after a meeting, the share where the customer contradicts a known value. */
const KYC_CONFLICT_CHANCE = 0.2;
/** Chance per met meeting that the RE settles an open conflict. */
const KYC_SETTLE_CHANCE = 0.25;

interface SimCustomer {
  readonly id: string;
  readonly reId: string;
  stage: CustomerStage;
  /** Has an appointment still to come. */
  busy: boolean;
  readonly kyc: SimKyc;
}

interface SimKyc {
  notes: number;
  hasBirthDate: boolean;
  /** Topics not asked yet, roughly in the order an RE gets to them. */
  readonly topics: (typeof KYC_TOPICS)[number][];
  /** Facts in effect on each trường the RE confirmed: one, or several in conflict. */
  readonly current: Map<KycField, { readonly id: string; readonly value: KycValue }[]>;
}

interface Slot {
  readonly re: Person;
  /** A rescheduled appointment already booked for the day; otherwise one is booked then. */
  readonly booked?: Booked;
}

interface Booked {
  readonly id: string;
  readonly customer: SimCustomer;
}

export function seedDemoData(db: Database, options: SeedOptions): void {
  const rng = createRng(options.seed);
  const anchor = dayNumber(options.anchorDate);
  let today = anchor - HISTORY_DAYS;
  let tick = 0;
  const sources = {
    // Timestamps stop at the anchor day: what lies after it is only scheduled. Noon UTC keeps the
    // local day of a profile change (D2) on the simulated day in any time zone of UTC±11.
    now: () => new Date((Math.min(today, anchor) + 0.5) * DAY_MS + tick++),
    random: rng.fill,
  };
  db.withSources(sources, () =>
    db.transaction(() => {
      if (listTeams(db).length > 0 || listPeople(db).length > 0) {
        throw new DbError('SEED_DATABASE_NOT_EMPTY');
      }
      const simulate = simulation(db, rng, anchor);
      for (; today <= anchor + FUTURE_DAYS; today++) simulate(today);
    }),
  );
}

function simulation(db: Database, rng: Rng, anchor: number): (day: number) => void {
  const start = anchor - HISTORY_DAYS;
  const end = anchor + FUTURE_DAYS;
  const coordinators = new Map<string, Person[]>();
  const customers = new Map<string, SimCustomer[]>();
  const arrivals = new Map<number, Person[]>();
  const agenda = new Map<number, Slot[]>();
  const issues = new Map<number, { id: string; fyp: Vnd }[]>();
  const add = <T>(map: Map<number, T[]>, day: number, item: T) =>
    map.set(day, [...(map.get(day) ?? []), item]);

  const kyc = kycSimulation(db, rng);
  const names = new Set<string>();
  const staffName = (): string => {
    const name = personName(rng);
    if (names.has(name)) return staffName();
    names.add(name);
    return name;
  };
  const shared = (['IS', 'BD', 'BDM'] as const).map((role) =>
    createPerson(db, { name: staffName(), role, teamId: null }),
  );
  const res: Person[] = [];
  for (const teamName of TEAM_NAMES) {
    const team = createTeam(db, { name: teamName });
    const tl = createPerson(db, { name: staffName(), role: 'TL', teamId: team.id });
    for (let i = 0; i < RES_PER_TEAM; i++) {
      const re = createPerson(db, { name: staffName(), role: 'RE', teamId: team.id });
      res.push(re);
      coordinators.set(re.id, [tl, ...shared]);
      customers.set(re.id, []);
      for (let c = 0; c < CUSTOMERS_PER_RE; c++) {
        add(arrivals, c < STARTING_CUSTOMERS ? start : rng.int(start + 1, anchor - 7), re);
      }
    }
  }

  const arrive = (re: Person, day: number) => {
    const given = profile(rng);
    const record = createCustomer(db, {
      name: personName(rng),
      reId: re.id,
      stage: rng.weighted(STARTING_STAGES),
      date: toDate(day),
      ...given,
    });
    const customer: SimCustomer = {
      id: record.id,
      reId: re.id,
      stage: record.stage,
      busy: false,
      kyc: {
        notes: 0,
        hasBirthDate: given.birthDate !== null,
        topics: [...KYC_TOPICS],
        current: new Map(),
      },
    };
    customers.get(re.id)!.push(customer);
    kyc.learn(customer, day, 2);
  };

  const book = (re: Person, day: number): Booked | undefined => {
    const free = customers.get(re.id)!.filter((c) => !c.busy);
    const open = free.filter((c) => isPipelineStage(c.stage));
    const closed = free.filter((c) => !isPipelineStage(c.stage));
    const pool = closed.length > 0 && rng.chance(0.08) ? closed : open;
    if (pool.length === 0) return undefined;
    // REs see customers closer to a policy more often: of two picks, the one in the higher stage.
    const [a, b] = [rng.pick(pool), rng.pick(pool)];
    const customer = stageRank(b.stage) > stageRank(a.stage) ? b : a;
    customer.busy = true;
    const appointment = scheduleAppointment(db, {
      customerId: customer.id,
      reId: re.id,
      date: toDate(day),
      time: rng.chance(0.9) ? rng.pick(APPOINTMENT_TIMES) : null,
      triggerType: rng.weighted(TRIGGERS),
      triggerNote: rng.chance(0.4) ? rng.pick(TRIGGER_NOTES) : null,
      coordinatorIds: rng.chance(0.15) ? [rng.pick(coordinators.get(re.id)!).id] : [],
    });
    return { id: appointment.id, customer };
  };

  const submit = (customer: SimCustomer, day: number) => {
    const fyp = rng.pick(CASE_SIZES_MILLION) * MILLION;
    const policy = submitPolicy(db, {
      customerId: customer.id,
      reId: customer.reId,
      submittedDate: toDate(day),
      submittedFyp: fyp,
    });
    const issueDay = day + rng.int(5, 35);
    if (issueDay < anchor) add(issues, issueDay, { id: policy.id, fyp });
  };

  const resolve = (re: Person, { id, customer }: Booked, day: number) => {
    const outcome = rng.weighted(OUTCOMES);
    if (outcome === 'RESCHEDULE') {
      const later = day + rng.int(1, 10);
      const moved = rescheduleAppointment(db, id, {
        date: toDate(later),
        time: rng.pick(APPOINTMENT_TIMES),
      });
      add(agenda, later, { re, booked: { id: moved.id, customer } });
      return;
    }
    customer.busy = false;
    if (outcome !== 'MET') {
      recordMeetingOutcome(db, id, { status: outcome });
      return;
    }
    const stageAfter = nextStage(rng, customer.stage);
    recordMeetingOutcome(db, id, {
      status: 'MET',
      stageAfter,
      nextStep: rng.pick(NEXT_STEPS),
      expectedCaseSize: rng.chance(0.7) ? rng.pick(CASE_SIZES_MILLION) * MILLION : null,
      note: rng.pick(MEETING_NOTES),
    });
    customer.stage = stageAfter;
    kyc.afterMeeting(customer, day);
    if (stageAfter === 'N1' && rng.chance(POLICY_CHANCE)) submit(customer, day);
  };

  /** Now and then an RE moves a customer down or on hold by hand, outside any meeting. */
  const manualChange = (re: Person, day: number) => {
    const open = customers.get(re.id)!.filter((c) => isPipelineStage(c.stage));
    if (open.length === 0) return;
    const customer = rng.pick(open);
    const lower = PIPELINE_STAGES[PIPELINE_STAGES.indexOf(customer.stage as 'N4') - 1];
    const to = lower !== undefined && rng.chance(0.5) ? lower : 'ON_HOLD';
    changeStageManually(db, customer.id, { to, date: toDate(day) });
    customer.stage = to;
  };

  return (day) => {
    if ((day - start) % 7 === 0) {
      for (const re of res) {
        const weekdays = rng.shuffle([0, 1, 2, 3, 4, 5]).slice(0, rng.int(3, 4));
        for (const offset of weekdays) {
          if (day + offset <= end) add(agenda, day + offset, { re });
        }
      }
    }
    for (const re of arrivals.get(day) ?? []) arrive(re, day);
    for (const { id, fyp } of issues.get(day) ?? []) {
      issuePolicy(db, id, {
        issuedDate: toDate(day),
        ...(rng.chance(0.1) ? { issuedFyp: Math.round(fyp * 0.9) } : {}),
      });
    }
    for (const slot of agenda.get(day) ?? []) {
      const booked = slot.booked ?? book(slot.re, day);
      if (booked && day < anchor) resolve(slot.re, booked, day);
    }
    if (day < anchor) {
      for (const re of res) if (rng.chance(0.01)) manualChange(re, day);
    }
  };
}

/** KYC grows with the meetings (spec §7): notes, facts, conflicts and their settling. */
function kycSimulation(db: Database, rng: Rng) {
  const line = (field: KycField, value: KycValue) =>
    `${KYC_VALUES[field]!.label}: ${typeof value === 'boolean' ? (value ? 'có' : 'chưa có') : value}`;
  const addNote = (customer: SimCustomer, day: number, lines: string[]) => {
    customer.kyc.notes++;
    return addKycNote(db, customer.id, { text: lines.join('; '), date: toDate(day) }).id;
  };

  /** A few topics: every trường chính, the other trường by chance. */
  const learn = (customer: SimCustomer, day: number, count = rng.int(1, 2)) => {
    const { topics, current } = customer.kyc;
    const asked = Array.from(
      { length: Math.min(count, topics.length) },
      () => topics.splice(rng.chance(0.7) ? 0 : rng.int(0, topics.length - 1), 1)[0]!,
    );
    const facts = asked
      .flatMap(({ fields }) =>
        fields
          .filter(([, chance]) => rng.chance(chance))
          .map(([field]) => [field, rng.pick(KYC_VALUES[field]!.values)] as const),
      )
      // "Bảo vệ hiện có" only follows a yes to "Đã có bảo vệ".
      .filter(
        ([field], _, all) =>
          field !== 'protectionDetails' || all.some(([f, v]) => f === 'hasProtection' && v),
      );
    const noteId = addNote(
      customer,
      day,
      facts.map(([field, value]) => line(field, value)),
    );
    for (const [field, value] of facts) {
      const material = rng.chance(0.05);
      const { fact } = confirmKycFact(db, customer.id, {
        field,
        value,
        noteId,
        date: toDate(day),
        material,
      });
      current.set(field, [{ id: fact.id, value }]);
    }
  };

  /** The customer gives another value for a known trường, a cốt lõi one half the time. */
  const contradict = (customer: SimCustomer, day: number) => {
    const { current } = customer.kyc;
    const settled = [...current.keys()].filter((field) => current.get(field)!.length === 1);
    const core = settled.filter((field) => KYC_FIELDS[field].core);
    const pool = core.length > 0 && rng.chance(0.5) ? core : settled;
    if (pool.length === 0) return;
    const field = rng.pick(pool);
    const facts = current.get(field)!;
    const value = rng.pick(
      KYC_VALUES[field]!.values.filter((v) => !facts.some((fact) => fact.value === v)),
    );
    const noteId = addNote(customer, day, [`KH cho biết lại ${line(field, value)}`]);
    const { fact } = markKycConflict(db, customer.id, { field, value, noteId, date: toDate(day) });
    facts.push({ id: fact.id, value });
  };

  const afterMeeting = (customer: SimCustomer, day: number) => {
    const { current } = customer.kyc;
    if (!customer.kyc.hasBirthDate && rng.chance(BIRTH_DATE_CHANCE)) {
      // Through the profile: a SYSTEM note and the birth year fact (D2).
      updateCustomerProfile(db, customer.id, { birthDate: { year: rng.int(1960, 2000) } });
      customer.kyc.hasBirthDate = true;
    }
    for (const [field, facts] of current) {
      if (facts.length < 2 || !rng.chance(KYC_SETTLE_CHANCE)) continue;
      const kept = rng.pick(facts);
      resolveKycConflict(db, customer.id, { factId: kept.id, date: toDate(day) });
      current.set(field, [kept]);
    }
    if (customer.kyc.notes >= MAX_KYC_NOTES || !rng.chance(KYC_NOTE_CHANCE)) return;
    if (customer.kyc.topics.length === 0 || rng.chance(KYC_CONFLICT_CHANCE)) {
      contradict(customer, day);
    } else {
      learn(customer, day);
    }
  };

  return { learn, afterMeeting };
}

function nextStage(rng: Rng, stage: CustomerStage): CustomerStage {
  if (!isPipelineStage(stage)) return rng.chance(0.5) ? 'N3' : stage;
  const index = PIPELINE_STAGES.indexOf(stage);
  switch (rng.weighted(MOVES)) {
    case 'up':
      return PIPELINE_STAGES[Math.min(index + 1, PIPELINE_STAGES.length - 1)]!;
    case 'down':
      return PIPELINE_STAGES[Math.max(index - 1, 0)]!;
    case 'hold':
      return 'ON_HOLD';
    case 'lost':
      return 'LOST';
    default:
      return stage;
  }
}

/** N4 → 0 … N1 → 3; closed stages rank below every open one. */
function stageRank(stage: CustomerStage): number {
  return PIPELINE_STAGES.indexOf(stage as 'N4');
}

function personName(rng: Rng): string {
  return `${rng.pick(FAMILY_NAMES)} ${rng.pick(MIDDLE_NAMES)} ${rng.pick(GIVEN_NAMES)}`;
}

/** Most customers gave a full birth date, some only the year, a few nothing yet (spec §3.3). */
function profile(rng: Rng): { birthDate: BirthDate | null; gender: Gender | null } {
  const year = rng.int(1960, 2000);
  const kind = rng.weighted(BIRTH_DATE_KINDS);
  const birthDate =
    kind === 'full'
      ? calendarDate(year, rng.int(1, 12), rng.int(1, 28))
      : kind === 'year'
        ? { year }
        : null;
  return { birthDate, gender: rng.chance(0.85) ? rng.pick(['MALE', 'FEMALE'] as const) : null };
}

// ---- days and randomness ----------------------------------------------------

function dayNumber(date: CalendarDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / DAY_MS;
}

function toDate(day: number): CalendarDate {
  const at = new Date(day * DAY_MS);
  return calendarDate(at.getUTCFullYear(), at.getUTCMonth() + 1, at.getUTCDate());
}

interface Rng {
  next(): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<T>(items: readonly T[]): T;
  weighted<T>(entries: Weighted<T>): T;
  shuffle<T>(items: T[]): T[];
  fill: RandomFill;
}

/** mulberry32: small, fast and stable across engines. */
function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  return {
    next,
    int,
    chance: (probability) => next() < probability,
    pick: (items) => items[int(0, items.length - 1)]!,
    weighted(entries) {
      const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
      let roll = next() * total;
      for (const [value, weight] of entries) {
        roll -= weight;
        if (roll < 0) return value;
      }
      return entries.at(-1)![0];
    },
    shuffle(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = int(0, i);
        [items[i], items[j]] = [items[j]!, items[i]!];
      }
      return items;
    },
    fill(bytes) {
      for (let i = 0; i < bytes.length; i++) bytes[i] = int(0, 255);
      return bytes;
    },
  };
}
