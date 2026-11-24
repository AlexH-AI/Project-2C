import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { AppointmentRecord } from '@p2c/db';
import {
  compareDates,
  formatDate,
  formatDayMonth,
  formatLocalTime,
  fromLocalDate,
  weekdayOf,
  type Scope,
} from '@p2c/domain';
import { Button, NavIcon, useLayerState, type NavIconName } from '@p2c/ui';
import { useDatabase, useTables } from '../data/AppDataContext';
import { joinParts, t } from '../i18n';
import { createdToast, withTime } from '../routes/appointments/appointment-form';
import {
  appointmentRows,
  personLabel,
  statusLabel,
  type AppointmentRow,
} from '../routes/appointments/appointments-view';
import { OutcomeDialog } from '../routes/appointments/OutcomeDialog';
import { BADGE } from '../routes/classes';
import {
  jobPillText,
  jobText,
  pillJob,
  useJobs,
  type BackgroundJob,
  type JobKind,
} from './background-jobs';
import { headsUp, leftText, type HeadsUp as HeadsUpView, type HeadsUpState } from './heads-up';
import { useMasked } from './NameMask';
import { routeToHash } from './routes';
import { useToast } from './Toasts';
import { navigate } from './useRoute';

/** Below this width of the window the pill leaves out the customer's name (mockup `#now`). */
const NARROW_WIDTH = 1240;

const onResize = (listener: () => void) => {
  addEventListener('resize', listener);
  return () => removeEventListener('resize', listener);
};
const narrowNow = () => innerWidth < NARROW_WIDTH;

/** What takes the focus a press gives (`CONTROL` of packages/ui `Menu.tsx`). */
const CONTROL =
  'a[href], button:enabled, input:enabled, select:enabled, textarea:enabled, [tabindex]';

/**
 * The app's clock (`clockNow`, the e2e day pinned), read again as each minute starts: what "còn 25
 * phút" counts from. A save or a new screen does not read it, so the pill stays on its minute.
 */
function useMinute(): Date {
  const db = useDatabase();
  const [now, setNow] = useState(() => db.clockNow());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wait = (at: Date) => {
      timer = setTimeout(
        () => {
          const next = db.clockNow();
          setNow(next);
          wait(next);
        },
        60_000 - (at.getSeconds() * 1_000 + at.getMilliseconds()),
      );
    };
    wait(db.clockNow());
    return () => clearTimeout(timer);
  }, [db]);
  return now;
}

const JOB_ICON = { export: 'export', backup: 'data', ai: 'ai' } as const satisfies Record<
  JobKind,
  NavIconName
>;

/** The check and the alert of a toast (`MARKS` of packages/ui, not exported): done, failed. */
const ENDED = { done: 'M5 12.5l4.5 4.5L19 7.5', failed: 'M12 4l9 16H3zM12 10v4M12 17v.01' };

/** A job's icon: its kind's while it runs, then a check or an alert. */
function JobIcon({ job }: { job: BackgroundJob }) {
  if (job.state === 'running')
    return <NavIcon name={JOB_ICON[job.kind]} className="size-3.75 flex-none text-fg-2" />;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`size-3.75 flex-none fill-none stroke-current ${job.state === 'done' ? 'text-ok' : 'text-danger'}`}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ENDED[job.state]} />
    </svg>
  );
}

/**
 * The pill as a job takes it (mockup `#now`): its icon and words, and a bar while it runs. Nothing
 * is measured (`BackgroundJob`), so the bar is full and pulses, with no percent. A narrow window
 * keeps the icon and the bar of one running, and fewer words of one ended.
 */
function JobFace({ job, name, narrow }: { job: BackgroundJob; name: string; narrow: boolean }) {
  const running = job.state === 'running';
  return (
    <>
      <JobIcon job={job} />
      {!running && (
        <b className={`min-w-0 truncate font-semibold ${narrow ? 'max-w-37.5' : ''}`}>
          {jobPillText(job, name)}
        </b>
      )}
      {running && !narrow && <span className="min-w-0 truncate">{jobText(job, name)}</span>}
      {running && (
        <span
          role="progressbar"
          aria-label={t('jobs.progress')}
          className={`h-1 flex-none rounded-full bg-accent motion-safe:animate-pulse ${narrow ? 'w-13' : 'w-21'}`}
        />
      )}
    </>
  );
}

/** `T4 11/11 09:00`: the day of an appointment whose year is clear from context, and its time. */
const dayText = (a: AppointmentRecord) =>
  withTime(`${t(`weekday.${weekdayOf(a.date)}`)} ${formatDayMonth(a.date)}`, a.time);

/**
 * "Lưu ý" (VA9, mockup search-rm-team.html `#now`, `#ask` 3): a pill between the name of the screen
 * and its buttons, on every screen, for the scope picked on the toolbar: the next appointment and
 * the time left until it; once today has none left, the day of the next one. A narrow window
 * leaves out the name. A press opens the panel of today under it (`TodayPanel`); Esc, a press
 * outside or the focus going elsewhere closes it, the focus back on the pill. A job in the
 * background takes the pill while it runs, a few seconds once done, and once failed until a press
 * runs it again (VA9b-a), whatever the screen.
 */
export function HeadsUp({ scope, label }: { scope: Scope; label: string }) {
  const { appointments, customers, people } = useTables();
  const now = useMinute();
  const jobs = useJobs();
  const job = pillJob(useSyncExternalStore(jobs.subscribe, jobs.list));
  const failed = job?.state === 'failed';
  const view = useMemo(
    () => headsUp(appointments, people, scope, now),
    [appointments, people, scope, now],
  );
  const narrow = useSyncExternalStore(onResize, narrowNow, () => false);
  const masked = useMasked();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { drawn, layer } = useLayerState(open);
  const [recording, setRecording] = useState<AppointmentRow | null>(null);
  const toast = useToast();
  const close = () => {
    setOpen(false);
    pill.current?.focus();
  };
  // The layer of a menu (`useLayer` of packages/ui, not exported): focus in it once open.
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const outside = (target: EventTarget | null) =>
      target instanceof Node && !root.current?.contains(target);
    const onPress = (event: PointerEvent) => {
      if (!outside(event.target)) return;
      setOpen(false);
      if (event.target instanceof Element && event.target.closest(CONTROL)) return;
      // Once the press on what takes no focus is over, the focus left on the page goes back to
      // the pill; a press that ends in a drag (a cancel) leaves it alone (L231).
      const settle = (end: PointerEvent) => {
        document.removeEventListener('pointerup', settle);
        document.removeEventListener('pointercancel', settle);
        const now = document.activeElement;
        if (end.type === 'pointerup' && (!now || now === document.body)) pill.current?.focus();
      };
      document.addEventListener('pointerup', settle);
      document.addEventListener('pointercancel', settle);
    };
    const onFocus = (event: FocusEvent) => {
      if (outside(event.target)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      pill.current?.focus();
    };
    document.addEventListener('pointerdown', onPress);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPress);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const next = view.next;
  const later = next && compareDates(next.appointment.date, fromLocalDate(now)) > 0;
  const nameOf = (id: string | undefined) =>
    masked.name(customers.find((customer) => customer.id === id)?.name ?? '');
  const name = (a: AppointmentRecord) => nameOf(a.customerId);
  // What the pill says: [what, who, when]; a narrow window leaves out the middle.
  const [what, who, when] = !next
    ? ['', t('headsUp.none'), '']
    : later
      ? ['', t('headsUp.dayOver'), t('headsUp.nextOn', { when: dayText(next.appointment) })]
      : [
          next.appointment.time ?? '',
          name(next.appointment),
          next.minutesLeft === null ? t('headsUp.allDay') : leftText(next.minutesLeft),
        ];
  const showWho = who !== '' && !(narrow && when);
  // Read as shown: the time and the name, then "·" before the time left only beside a name.
  const head = [what, showWho ? who : ''].filter(Boolean).join(' ');
  const text = showWho && when ? joinParts([head, when]) : [head, when].filter(Boolean).join(' ');
  const jobName = job && nameOf(job.customerId);
  return (
    <span ref={root} className="relative flex min-w-0 justify-center">
      <button
        ref={pill}
        type="button"
        // A failure's press runs its job again, as the pill says (mockup `#now`).
        aria-haspopup={failed ? undefined : 'dialog'}
        aria-expanded={failed ? undefined : open}
        aria-label={t('headsUp.label', { text: job ? jobPillText(job, jobName!) : text })}
        onClick={() => {
          if (!failed) return open ? close() : setOpen(true);
          setOpen(false);
          job.retry?.();
        }}
        className={`press btn-default inline-flex h-8.5 max-w-95 min-w-0 cursor-pointer items-center gap-2 rounded-control pr-3.25 pl-2.75 text-md whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${failed ? 'outline-1 -outline-offset-1 outline-danger' : ''}`}
      >
        {job ? (
          <JobFace job={job} name={jobName!} narrow={narrow} />
        ) : (
          <>
            {next && !later ? (
              <span className="size-1.75 flex-none rounded-full bg-accent ring-3 ring-accent-soft motion-safe:animate-pulse" />
            ) : (
              <NavIcon name="calendar" className="size-3.75 flex-none text-fg-2" />
            )}
            {what && <b className="font-semibold tabular-nums">{what}</b>}
            {showWho && <span className="min-w-0 shrink-1000 truncate">{who}</span>}
            {showWho && when && <span className="text-fg-3">{t('sep.dot')}</span>}
            {when && <span className="min-w-0 truncate text-fg-2 tabular-nums">{when}</span>}
          </>
        )}
      </button>
      {drawn && (
        <div
          ref={panel}
          role="dialog"
          aria-label={t('headsUp.title')}
          tabIndex={-1}
          {...layer}
          className="pop motion-layer absolute top-full left-1/2 z-20 mt-2 w-98 -translate-x-1/2 rounded-pop px-4 pt-3.5 pb-3 text-md tabular-nums outline-none"
        >
          <TodayPanel
            view={view}
            label={label}
            now={now}
            // The focus on the pill first: 6c gives it back to what held it as it opened.
            onRecord={(row) => {
              close();
              setRecording(row);
            }}
            onRetry={(failure) => {
              close();
              failure.retry?.();
            }}
            onClose={close}
          />
        </div>
      )}
      {recording?.customer && (
        <OutcomeDialog
          row={{ ...recording, customer: recording.customer }}
          people={people}
          onClose={() => setRecording(null)}
          onShow={(made) => toast.show(createdToast(made))}
        />
      )}
    </span>
  );
}

const ROW_END: Partial<Record<HeadsUpState, string>> = { next: `${BADGE} text-info` };

/**
 * The panel of today (mockup `#now`, "Bảng hôm nay"): every appointment of the day by time, the
 * next one on a light gold, one passed with no outcome with "Ghi kết quả" (dialog 6c); "Cần làm"
 * leads to Lịch hẹn; "Việc chạy nền", the jobs running and the latest ended, Thử lại by a failure.
 * Masked names show masked.
 */
function TodayPanel({
  view,
  label,
  now,
  onRecord,
  onRetry,
  onClose,
}: {
  view: HeadsUpView;
  /** The scope as the toolbar names it. */
  label: string;
  now: Date;
  onRecord: (row: AppointmentRow) => void;
  onRetry: (job: BackgroundJob) => void;
  /** Closes the panel, the focus back on the pill: a new screen then gives it to its name. */
  onClose: () => void;
}) {
  const { customers, people, teams, transitions } = useTables();
  const masked = useMasked();
  const jobs = useJobs();
  const jobList = useSyncExternalStore(jobs.subscribe, jobs.list);
  const today = fromLocalDate(now);
  const rows = appointmentRows(
    {
      appointments: view.today.map((row) => row.appointment),
      customers,
      people,
      teams,
      transitions,
    },
    { kind: 'all' },
    'any',
  );
  const date = t('date.read', {
    weekday: t(`weekdayLong.${weekdayOf(today)}`),
    date: formatDate(today),
  });
  const heading = 'm-0 mb-1.5 flex items-baseline gap-2 text-sm font-semibold';
  const list = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    const next = list.current?.querySelector<HTMLElement>('[data-next]');
    if (list.current && next)
      list.current.scrollTop = next.offsetTop - list.current.clientHeight / 3;
  }, []);
  return (
    <>
      <h2 className={heading}>
        {t('headsUp.today')}
        <small className="text-xs font-normal text-fg-2">
          {t('headsUp.todayMeta', {
            date,
            scope: label,
            count: rows.length,
          })}
        </small>
      </h2>
      {rows.length === 0 && <p className="m-0 text-sm text-fg-2">{t('headsUp.todayNone')}</p>}
      {/* A busy day scrolls in the panel, which opens on the next one. */}
      <ul
        ref={list}
        className="relative -mx-2 my-0 flex max-h-100 list-none flex-col overflow-y-auto px-2"
      >
        {rows.map((row, index) => {
          const a = row.appointment;
          const state = view.today[index]!.state;
          const status = statusLabel(a, today);
          const line = joinParts([
            state === 'unrecorded' ? t('appointments.statusUnrecorded') : '',
            row.rm ? personLabel(row.rm) : '',
            row.team?.name ?? '',
          ]);
          const left = view.next?.minutesLeft;
          return (
            <li
              key={a.id}
              data-next={state === 'next' || undefined}
              className={`-mx-2 flex flex-none items-center gap-2.5 rounded-control-sm px-2 py-1.75 ${state === 'next' ? 'bg-accent-soft' : ''}`}
            >
              <span className="w-11.5 flex-none font-semibold">{a.time}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className="truncate font-semibold">{masked.name(row.customer?.name ?? '')}</b>
                <small className="truncate text-xs text-fg-2">{line}</small>
              </span>
              {state === 'unrecorded' ? (
                <Button variant="primary" size="sm" onClick={() => onRecord(row)}>
                  {t('appointments.record')}
                </Button>
              ) : (
                <span className={ROW_END[state] ?? status.tone}>
                  {state !== 'next'
                    ? status.text
                    : left === null || left === undefined
                      ? t('headsUp.allDay')
                      : leftText(left)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <hr className="my-2.5 border-0 border-t border-hairline" />
      <h2 className={heading}>{t('headsUp.todo')}</h2>
      {view.unrecorded > 0 ? (
        <Button
          size="sm"
          onClick={() => {
            onClose();
            navigate(routeToHash({ screen: 'appointments' }));
          }}
        >
          {t('headsUp.unrecorded', { count: view.unrecorded })}
        </Button>
      ) : (
        <p className="m-0 text-sm text-fg-2">{t('headsUp.unrecordedNone')}</p>
      )}
      <hr className="my-2.5 border-0 border-t border-hairline" />
      <h2 className={heading}>{t('jobs.title')}</h2>
      {jobList.length === 0 ? (
        <p className="m-0 text-sm text-fg-2">{t('jobs.none')}</p>
      ) : (
        <ul aria-label={t('jobs.title')} className="m-0 flex list-none flex-col p-0">
          {jobList.map((job) => (
            <li key={job.id} className="flex min-h-8 items-center gap-2 py-1">
              <JobIcon job={job} />
              <span className="min-w-0 flex-1 truncate">
                {jobText(
                  job,
                  masked.name(customers.find((c) => c.id === job.customerId)?.name ?? ''),
                )}
              </span>
              {job.state === 'failed' ? (
                <Button size="sm" onClick={() => onRetry(job)}>
                  {t('jobs.retry')}
                </Button>
              ) : (
                job.endedAt && (
                  <span className="text-xs text-fg-2">{formatLocalTime(job.endedAt)}</span>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
