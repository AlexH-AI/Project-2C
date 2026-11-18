import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
import type { TrashRow } from '@p2c/db';
import { Toast } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import { t } from '../i18n';
import { createToastQueue, type Toaster, type ToastQueue } from './toast-queue';
import { deletedToast } from './trash-undo';

const ToastContext = createContext<ToastQueue | null>(null);

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

/**
 * Where the toast shows: the middle of the bottom edge of the window, over the screen and taking
 * none of its clicks. A polite live region, always there so that what appears in it is read out
 * (DR-72), holds it; an error comes as an alert of its own, with a × since it stays. The lighter
 * words come after a dot, as in the mockup. The toast takes no focus; last in the page, as it is
 * last on screen, its button is reached by Tab. A button that goes with its toast while it holds
 * the focus gives it to the screen's heading, as the save warning does (`SaveWarning`).
 */
export function ToastRegion({ heading }: { heading: RefObject<HTMLElement | null> }) {
  const queue = useToastQueue();
  const toast = useSyncExternalStore(queue.subscribe, queue.current, queue.current);
  const region = useRef<HTMLDivElement>(null);
  // The queue tells its listeners as the toast changes, before React renders its buttons away.
  useEffect(
    () =>
      queue.subscribe(() => {
        if (region.current?.contains(document.activeElement)) heading.current?.focus();
      }),
    [queue, heading],
  );
  const error = toast?.tone === 'error';
  const view = toast && (
    <Toast
      text={toast.text}
      detail={toast.detail && `${t('sep.dot')} ${toast.detail}`}
      tone={toast.tone}
      action={toast.action && { label: toast.action.label, onClick: queue.act }}
      close={error ? { label: t('toast.close'), onClick: queue.dismiss } : undefined}
    />
  );
  return (
    <div
      ref={region}
      className="pointer-events-none fixed inset-x-0 bottom-5.5 z-40 flex justify-center px-4"
    >
      <div aria-live="polite" aria-atomic="true" className="pointer-events-auto flex max-w-full">
        {!error && view}
      </div>
      {error && (
        <div role="alert" className="pointer-events-auto flex max-w-full">
          {view}
        </div>
      )}
    </div>
  );
}
