import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { formatDate, formatLocalTime, fromLocalDate, weekdayOf, type Scope } from '@p2c/domain';
import { Button, Mark, NavIcon, useLayer, type NavIconName } from '@p2c/ui';
import { useDatabase, useTables } from '../data/AppDataContext';
import { joinParts, t } from '../i18n';
import { createdToast } from '../routes/appointments/appointment-form';
import {
  appointmentRows,
  personLabel,
  statusLabel,
  type AppointmentRow,
} from '../routes/appointments/appointments-view';
import { OutcomeDialog } from '../routes/appointments/OutcomeDialog';
import { BADGE } from '../routes/classes';
import {
  jobPercent,
  jobPillText,
  jobText,
  pillJob,
  useJobs,
  type BackgroundJob,
  type JobKind,
} from './background-jobs';
import {
  headsUp,
  leftText,
  pillText,
  shownJobs,
  watchMinute,
  type HeadsUp as HeadsUpView,
  type HeadsUpState,
} from './heads-up';
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

/**
 * The app's clock (`clockNow`, the e2e day pinned), what "còn 25 phút" counts from: read on every
 * render of the toolbar, and as each minute starts and as the window wakes (`watchMinute`). The
 * pill changes only as a new minute starts: a render within the same minute gives the same moment.
 */
function useMinute(): Date {
  const db = useDatabase();
  const clock = useMemo(() => watchMinute(() => db.clockNow()), [db]);
  return useSyncExternalStore(clock.subscribe, clock.current);
}

const JOB_ICON = { export: 'export', backup: 'data', ai: 'ai' } as const satisfies Record<
  JobKind,
  NavIconName
>;

/** A job's icon: its kind's while it runs, then the check or the alert of a toast. */
function JobIcon({ job }: { job: BackgroundJob }) {
  if (job.state === 'running')
    return <NavIcon name={JOB_ICON[job.kind]} className="size-3.75 flex-none text-fg-2" />;
  const done = job.state === 'done';
  return (
    <Mark
      of={done ? 'check' : 'alert'}
      stroke={2}
      className={`size-3.75 flex-none ${done ? 'text-ok' : 'text-danger'}`}
    />
  );
}

/**
 * The pill as a job takes it (mockup `#now`): its icon and words, a bar and the percent while it
 * runs. Nothing measured, the bar is full and pulses, with no percent. A narrow window keeps the
 * icon, the bar and the percent of one running, and fewer words of one ended.
 */
function JobFace({ job, name, narrow }: { job: BackgroundJob; name: string; narrow: boolean }) {
  if (job.state !== 'running') {
    return (
      <>
        <JobIcon job={job} />
        <b className={`min-w-0 truncate font-semibold ${narrow ? 'max-w-37.5' : ''}`}>
          {jobPillText(job, name)}
        </b>
      </>
    );
  }
  const share = job.progress;
  const percent = jobPercent(job);
  return (
    <>
      <JobIcon job={job} />
      {!narrow && <span className="min-w-0 truncate">{jobText(job, name)}</span>}
      <span
        role="progressbar"
        aria-label={t('jobs.progress')}
        aria-valuetext={percent ?? undefined}
        className={`flex h-1 flex-none overflow-hidden rounded-full bg-fill-3 ${narrow ? 'w-13' : 'w-21'}`}
      >
        {/* A grow under 1 takes that share of the bar. */}
        {share === undefined ? (
          <i className="flex-1 rounded-full bg-accent motion-safe:animate-pulse" />
        ) : (
          <i className="rounded-full bg-accent" style={{ flex: share }} />
        )}
      </span>
      {percent && <span className="text-fg-2 tabular-nums">{percent}</span>}
    </>
  );
}

/**
 * "Lưu ý" (VA9, mockup search-rm-team.html `#now`, `#ask` 3): a pill between the name of the screen
 * and its buttons, on every screen, for the scope picked on the toolbar: the next appointment and
 * the time left until it; once today has none left, the day of the next one. A narrow window
 * leaves out the name. A press opens the panel of today under it (`TodayPanel`); Esc, a press
 * outside or the focus going elsewhere closes it, the focus back on the pill (`useLayer`). A job
 * in the background takes the pill while it runs, a few seconds once done, and once failed until
 * a press runs it again (VA9b-a), whatever the screen; an ended analysis of a customer no longer
 * there shows neither on the pill nor in the panel, one still running shows with no name
 * (`shownJobs`).
 */
export function HeadsUp({ scope, label }: { scope: Scope; label: string }) {
  const { appointments, customers, people } = useTables();
  const now = useMinute();
  const background = useJobs();
  const allJobs = useSyncExternalStore(background.subscribe, background.list);
  const jobs = useMemo(() => shownJobs(allJobs, customers), [allJobs, customers]);
  const job = pillJob(jobs);
  const failed = job?.state === 'failed';
  const view = useMemo(
    () => headsUp(appointments, people, scope, now),
    [appointments, people, scope, now],
  );
  const narrow = useSyncExternalStore(onResize, narrowNow, () => false);
  const masked = useMasked();
  const { open, setOpen, close, root, trigger: pill, drawn, layer } = useLayer();
  const panel = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState<AppointmentRow | null>(null);
  const toast = useToast();
  // The focus in the panel once open.
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  const nameOf = (id: string | undefined) =>
    masked.name(customers.find((customer) => customer.id === id)?.name ?? '');
  const words = pillText(view, now, narrow, (a) => nameOf(a.customerId));
  const { what, who, when } = words;
  const jobName = job && nameOf(job.customerId);
  return (
    <span ref={root} className="relative flex min-w-0 justify-center">
      <button
        ref={pill}
        type="button"
        // A failure's press runs its job again, as the pill says (mockup `#now`).
        aria-haspopup={failed ? undefined : 'dialog'}
        aria-expanded={failed ? undefined : open}
        aria-label={t('headsUp.label', {
          text: job ? joinParts([jobPillText(job, jobName!), jobPercent(job)]) : words.text,
        })}
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
            {words.today ? (
              <span className="size-1.75 flex-none rounded-full bg-accent ring-3 ring-accent-soft motion-safe:animate-pulse" />
            ) : (
              <NavIcon name="calendar" className="size-3.75 flex-none text-fg-2" />
            )}
            {what && <b className="font-semibold tabular-nums">{what}</b>}
            {/* Short of room, the customer's name is cut first, then the time left. Once today
                has none left, "kế tiếp …" is cut to nothing first, so that "Hết lịch hôm nay"
                stays whole (review of PR 1507): at 1000 to 1, "Hết lịch hôm nay" still gave up a
                sixteenth of a pixel, and an ellipsis took its end. */}
            {who && (
              <span className={`min-w-0 truncate ${words.today ? 'shrink-1000' : ''}`}>{who}</span>
            )}
            {who && when && <span className="text-fg-3">{t('sep.dot')}</span>}
            {when && (
              <span
                className={`min-w-0 truncate text-fg-2 tabular-nums ${words.today ? '' : 'shrink-100000'}`}
              >
                {when}
              </span>
            )}
          </>
        )}
      </button>
      {/* Gives up the part of a pixel the toolbar takes from the pill while it cuts the line
          under the name of the screen (`shrink-1000` of ScreenBar.tsx): taken from the words, it
          would end them in an ellipsis (Khách hàng at 1 100 px, review of PR 1507). */}
      <span aria-hidden="true" className="w-px shrink-100000" />
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
            jobs={jobs}
            nameOf={nameOf}
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
 * leads to Lịch hẹn; "Việc chạy nền", the jobs running and the latest ended, Thử lại by a failure;
 * a long list of them scrolls, so the panel stays in a window of 1 100 × 700 (review of PR 1505).
 * Masked names show masked.
 */
function TodayPanel({
  view,
  label,
  now,
  jobs,
  nameOf,
  onRecord,
  onRetry,
  onClose,
}: {
  view: HeadsUpView;
  /** The scope as the toolbar names it. */
  label: string;
  now: Date;
  /** The jobs "Lưu ý" shows, latest first. */
  jobs: readonly BackgroundJob[];
  /** A customer's name as the window shows it, masked or not. */
  nameOf: (customerId: string | undefined) => string;
  onRecord: (row: AppointmentRow) => void;
  onRetry: (job: BackgroundJob) => void;
  /** Closes the panel, the focus back on the pill: a new screen then gives it to its name. */
  onClose: () => void;
}) {
  const { customers, people, teams, transitions } = useTables();
  const masked = useMasked();
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
      {jobs.length === 0 ? (
        <p className="m-0 text-sm text-fg-2">{t('jobs.none')}</p>
      ) : (
        <ul
          aria-label={t('jobs.title')}
          className="-mx-2 my-0 flex max-h-16 list-none flex-col overflow-y-auto px-2"
        >
          {jobs.map((job) => (
            <li key={job.id} className="flex min-h-8 flex-none items-center gap-2 py-1">
              <JobIcon job={job} />
              <span className="min-w-0 flex-1 truncate">
                {jobText(job, nameOf(job.customerId))}
              </span>
              {job.state === 'failed' ? (
                <Button size="sm" onClick={() => onRetry(job)}>
                  {t('jobs.retry')}
                </Button>
              ) : (
                <span className="text-xs text-fg-2">
                  {job.endedAt ? formatLocalTime(job.endedAt) : jobPercent(job)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
