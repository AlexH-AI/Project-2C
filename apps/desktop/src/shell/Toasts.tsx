import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import type { TrashRow } from '@p2c/db';
import { Toast, useLayerState } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import { t } from '../i18n';
import { createToastQueue, type Toaster, type ToastQueue, type ToastSpec } from './toast-queue';
import { deletedToast } from './trash-undo';

const ToastContext = createContext<ToastQueue | null>(null);

const keys = new WeakMap<ToastSpec, number>();
let shownCount = 0;

/** A key of its own for each toast shown (`show` makes a new one every time). */
function keyOf(toast: ToastSpec): number {
  let key = keys.get(toast);
  if (key === undefined) keys.set(toast, (key = ++shownCount));
  return key;
}

function useToastQueue(): ToastQueue {
  const queue = useContext(ToastContext);
  if (!queue) throw new Error('useToast needs <ToastProvider> above it');
  return queue;
}

/**
 * The toast of the window (mockup components.html 08), for every screen: `show` says in one line
 * what just happened, with one button at most, and takes the place of the toast shown. What needs
 * reading with care, or a decision, is a dialog's; what stays until its cause is gone, a boxed
 * line's (mockup 10).
 */
export function useToast(): Toaster {
  return useToastQueue();
}

/**
 * Called once a record went to the trash: says so in a toast whose "Hoàn tác" restores it
 * (`deletedToast`).
 */
export function useTrashUndo(): (kind: TrashRow['kind'], id: string) => void {
  const app = useAppData();
  const toast = useToast();
  return useCallback((kind, id) => toast.show(deletedToast(app, toast, kind, id)), [app, toast]);
}

/** Holds the toast of the window for what is inside: the screens, and `ToastRegion`. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue] = useState(createToastQueue);
  // The clock of a toast goes with the window that shows it.
  useEffect(() => () => queue.dismiss(), [queue]);
  return <ToastContext value={queue}>{children}</ToastContext>;
}

/** The modal dialog on top, if one is open: what is outside it takes no click (`inert`). */
const topModal = () =>
  [...document.querySelectorAll<HTMLDialogElement>('dialog:modal')].at(-1) ?? null;
const watchModals = (changed: () => void) => {
  const changes = new MutationObserver(changed);
  changes.observe(document.body, { subtree: true, childList: true, attributeFilter: ['open'] });
  return () => changes.disconnect();
};

/** What takes the focus in a dialog when the button of its toast goes. */
const CONTROL = 'button:enabled, input:enabled, select:enabled, textarea:enabled, a[href]';

/** What takes a click in a dialog, on or off. */
const PRESSABLE = 'button, input, select, textarea, a[href]';

/**
 * Inside a dialog the toast lies at the bottom of the window, as outside, unless there it would
 * cover what takes a click in the dialog: on a dialog as tall as the window (1 100 × 700), the
 * buttons of its foot (review of PR 1493). It then lies just over those buttons, as far from them
 * as it would lie from the edge of the window: over the end of the dialog's body, for a while.
 */
function clearOfDialog(region: HTMLElement, dialog: HTMLElement) {
  region.style.removeProperty('bottom');
  const toast = region.getBoundingClientRect();
  if (toast.height === 0) return;
  const covered = [...dialog.querySelectorAll(PRESSABLE)]
    .filter((control) => !region.contains(control))
    .map((control) => control.getBoundingClientRect())
    .filter(
      (box) =>
        box.bottom > toast.top &&
        box.top < toast.bottom &&
        box.right > toast.left &&
        box.left < toast.right,
    );
  if (covered.length === 0) return;
  const top = Math.min(...covered.map((box) => box.top));
  region.style.bottom = `${innerHeight - top + (innerHeight - toast.bottom)}px`;
}

const MOVED = 'moved';
/**
 * Where each toast was read out first: the dialog whose region held it (`null`, the window's), or
 * `MOVED` once it has moved to another region since. One the browser never drew (in the region of
 * a dialog closing as it shows) is not yet read.
 */
const readIn = new WeakMap<ToastSpec, HTMLDialogElement | null | typeof MOVED>();

/**
 * As wide as its toast, in the middle of the window: inside a dialog, it stays in the width of the
 * dialog. As a popover, none of the box, colour and place the browser gives one.
 */
const REGION =
  'pointer-events-none fixed inset-x-0 top-auto bottom-5.5 z-40 mx-auto my-0 flex h-auto max-h-none w-fit max-w-none justify-center overflow-visible border-0 bg-transparent px-4 py-0 text-fg';

/**
 * Where the toast shows: the middle of the bottom edge of the window, over the screen and taking
 * none of its clicks. A polite live region, always there so that what appears in it is read out
 * (DR-72), holds it; an error comes as an alert of its own, with a × since it stays. The lighter
 * words come after a dot, as in the mockup. The toast takes no focus; last in the page, as it is
 * last on screen, its button is reached by Tab. A button that goes with its toast while it holds
 * the focus gives it to the screen's heading, as the save warning does (`SaveWarning`). While the
 * pointer is over the toast or the focus in it, it stays (`hold`), a new toast that comes under
 * the pointer too (review of PR 1420). Each toast shown is drawn anew, so that one of the same words is read out
 * again and rises again (review of PR 1404); one that leaves moves out (`motion-toast`) out of the live region,
 * taking nothing. While a modal dialog is open, the toast lies over it (mockup ui2.css: the toast
 * at z-index 40, the dialog 30; review of PR 1404), clear of its buttons (`clearOfDialog`): outside it, it would
 * lie under it, its button out of reach and its live region inert. So each modal dialog open has a
 * region of its own, a popover inside it, there before any toast goes into it; the region of the
 * window stays, empty meanwhile. A dialog that closes as its toast shows (a delete confirmed)
 * leaves it in the region of the window. A toast that moves to another region as a dialog opens or
 * closes is not read out again: it shows out of the live region (review of PR 1493). Wherever it
 * now lies, the pointer holds it only if it is on it there, once a dialog has moved in too (review
 * of PR 1507).
 */
export function ToastRegion({ heading }: { heading: RefObject<HTMLElement | null> }) {
  const queue = useToastQueue();
  const toast = useSyncExternalStore(queue.subscribe, queue.current, queue.current);
  const base = useRef<HTMLDivElement>(null);
  const hosted = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState(toast);
  if (toast && toast !== last) setLast(toast);
  const { drawn, layer } = useLayerState(toast !== null);
  const host = useSyncExternalStore(watchModals, topModal, () => null);
  // The queue tells its listeners as the toast changes, before React renders its buttons away.
  // Under a dialog the heading is inert: the focus goes into the dialog.
  useEffect(
    () =>
      queue.subscribe(() => {
        const focused = document.activeElement;
        if (![base.current, hosted.current].some((region) => region?.contains(focused))) return;
        const dialog = topModal();
        (dialog ? dialog.querySelector<HTMLElement>(CONTROL) : heading.current)?.focus();
      }),
    [queue, heading],
  );
  // Where the pointer was last, and whether that was on the region showing the toast.
  const pointer = useRef<{ readonly x: number; readonly y: number } | null>(null);
  const pointed = useRef(false);
  const point = useCallback(
    (on: boolean) => {
      pointed.current = on;
      queue.hold('pointer', on);
    },
    [queue],
  );
  // Read from every move, not from the region's own enter and leave: a toast that moves under a
  // still pointer, as a dialog opens or closes, gets neither.
  useEffect(() => {
    // The region of the window is empty while a dialog's shows the toast.
    const onMove = ({ clientX: x, clientY: y, target }: PointerEvent) => {
      pointer.current = { x, y };
      const on =
        target instanceof Node &&
        [base.current, hosted.current].some((region) => !!region?.contains(target));
      if (on !== pointed.current) point(on);
    };
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      // Out of the window.
      pointer.current = null;
      if (pointed.current) point(false);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, [point]);
  // A region that goes with its dialog, or empties as one opens, says nothing of the focus that
  // was on it (review of PR 1493).
  useEffect(() => {
    const region = host ? hosted.current : base.current;
    if (!region?.contains(document.activeElement)) queue.hold('focus', false);
  }, [queue, host]);
  // A dialog that closes as its toast shows (a delete confirmed) is gone before this runs.
  useLayoutEffect(() => {
    if (host && hosted.current?.isConnected) hosted.current.showPopover();
  }, [host]);
  // Where the toast lies, then whether the pointer is on it there, as the toast changes or goes to
  // another region, and as the window changes size: the region of the window lies at the middle of
  // its bottom edge. A toast that moves under a still pointer gets no move of it (reviews of PR
  // 1493, 1507, 1525). In a dialog it lies clear of the buttons, placed again as the dialog's size
  // changes and once the dialog has moved in: as it comes (`motion-dialog`) its buttons stand
  // higher, and a move tells no observer.
  useLayoutEffect(() => {
    const region = host ? hosted.current : base.current;
    if (!region?.isConnected) return;
    const place = () => {
      if (host) clearOfDialog(region, host);
      const at = pointer.current;
      point(!!at && region.contains(document.elementFromPoint(at.x, at.y)));
    };
    place();
    addEventListener('resize', place);
    if (!host) return () => removeEventListener('resize', place);
    const sized = new ResizeObserver(place);
    sized.observe(host);
    host.addEventListener('animationend', place);
    return () => {
      sized.disconnect();
      removeEventListener('resize', place);
      host.removeEventListener('animationend', place);
    };
  }, [host, toast, point]);
  // Read once the browser has it in a live region on the page.
  useLayoutEffect(() => {
    const region = host ? hosted.current : base.current;
    if (!toast || !region?.isConnected) return;
    if (!readIn.has(toast)) readIn.set(toast, host);
    else if (readIn.get(toast) !== host) readIn.set(toast, MOVED);
  }, [toast, host]);
  const moved = toast !== null && readIn.has(toast) && readIn.get(toast) !== host;
  const error = toast?.tone === 'error';
  const draw = (toast: ToastSpec) => (
    <Toast
      key={keyOf(toast)}
      text={toast.text}
      detail={toast.detail && `${t('sep.dot')} ${toast.detail}`}
      tone={toast.tone}
      action={toast.action && { label: toast.action.label, onClick: queue.act }}
      close={
        toast.tone === 'error' ? { label: t('toast.close'), onClick: queue.dismiss } : undefined
      }
    />
  );
  const view = toast && draw(toast);
  const frame = (shown: boolean, popover?: 'manual') => (
    <div
      ref={popover ? hosted : base}
      popover={popover}
      onFocus={() => queue.hold('focus', true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) queue.hold('focus', false);
      }}
      // The popover hidden while not open, as in the copy a dialog leaves for its move out.
      className={popover ? `${REGION} not-open:hidden` : REGION}
    >
      <div aria-live="polite" aria-atomic="true" className="pointer-events-auto flex max-w-full">
        {shown && !error && !moved && view}
      </div>
      {shown && error && !moved && (
        <div role="alert" className="pointer-events-auto flex max-w-full">
          {view}
        </div>
      )}
      {shown && moved && <div className="pointer-events-auto flex max-w-full">{view}</div>}
      {shown && !toast && drawn && last && (
        <div {...layer} className="flex max-w-full">
          {draw(last)}
        </div>
      )}
    </div>
  );
  return (
    <>
      {frame(host === null)}
      {host && createPortal(frame(true, 'manual'), host)}
    </>
  );
}
