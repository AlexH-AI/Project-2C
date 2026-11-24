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
const none = () => null;
const watchModals = (changed: () => void) => {
  const changes = new MutationObserver(changed);
  changes.observe(document.body, { subtree: true, childList: true, attributeFilter: ['open'] });
  return () => changes.disconnect();
};
const watchNothing = () => () => undefined;

/**
 * The modal dialog open while `watch` (a toast is shown), which the toast goes into (L198): a
 * toast outside it would lie under it, its button out of reach and its live region inert,
 * whatever its `z-index`. Watched only while a toast is shown: every change of the page is heard.
 */
const useModalHost = (watch: boolean): HTMLDialogElement | null =>
  useSyncExternalStore(watch ? watchModals : watchNothing, watch ? topModal : none, none);

/**
 * Where the toast shows: the middle of the bottom edge of the window, over the screen and taking
 * none of its clicks. A polite live region, always there so that what appears in it is read out
 * (DR-72), holds it; an error comes as an alert of its own, with a × since it stays. The lighter
 * words come after a dot, as in the mockup. The toast takes no focus; last in the page, as it is
 * last on screen, its button is reached by Tab. A button that goes with its toast while it holds
 * the focus gives it to the screen's heading, as the save warning does (`SaveWarning`). While the
 * pointer is over the toast or the focus in it, it stays (`hold`), a new toast that comes under
 * the pointer too (L229). Each toast shown is drawn anew, so that one of the same words is read out
 * again and rises again (L208); one that leaves moves out (`motion-toast`) out of the live region,
 * taking nothing. While a modal dialog is open, the toast lies over it (mockup ui2.css: the toast
 * at z-index 40, the dialog 30): a popover inside that dialog, so it takes clicks and is read.
 */
export function ToastRegion({ heading }: { heading: RefObject<HTMLElement | null> }) {
  const queue = useToastQueue();
  const toast = useSyncExternalStore(queue.subscribe, queue.current, queue.current);
  const region = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState(toast);
  if (toast && toast !== last) setLast(toast);
  const { drawn, layer } = useLayerState(toast !== null);
  const host = useModalHost(drawn);
  // The queue tells its listeners as the toast changes, before React renders its buttons away.
  useEffect(
    () =>
      queue.subscribe(() => {
        if (region.current?.contains(document.activeElement)) heading.current?.focus();
      }),
    [queue, heading],
  );
  // The pointer still on the region when a new toast takes the place of the one it was on.
  const pointed = useRef(false);
  useEffect(() => {
    if (toast && pointed.current) queue.hold('pointer', true);
  }, [queue, toast]);
  // A dialog that closes as its toast shows (a delete confirmed) is gone before this runs: the
  // region then goes back under the screen once the watch hears it.
  useLayoutEffect(() => {
    if (host && region.current?.isConnected) region.current.showPopover();
  }, [host]);
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
  const box = (
    <div
      ref={region}
      popover={host ? 'manual' : undefined}
      onPointerEnter={() => {
        pointed.current = true;
        queue.hold('pointer', true);
      }}
      onPointerLeave={() => {
        pointed.current = false;
        queue.hold('pointer', false);
      }}
      onFocus={() => queue.hold('focus', true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) queue.hold('focus', false);
      }}
      // As a popover: none of the box, colour and place the browser gives one.
      className="pointer-events-none fixed inset-x-0 top-auto bottom-5.5 z-40 m-0 flex size-auto max-h-none max-w-none justify-center overflow-visible border-0 bg-transparent px-4 py-0 text-fg"
    >
      <div aria-live="polite" aria-atomic="true" className="pointer-events-auto flex max-w-full">
        {!error && view}
      </div>
      {error && (
        <div role="alert" className="pointer-events-auto flex max-w-full">
          {view}
        </div>
      )}
      {!toast && drawn && last && (
        <div {...layer} className="flex max-w-full">
          {draw(last)}
        </div>
      )}
    </div>
  );
  return host ? createPortal(box, host) : box;
}
