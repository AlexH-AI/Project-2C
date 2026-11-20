import { notify } from '../data/listeners';

/** How long a toast stays before it leaves by itself (ADR-0013, appendix 14/11/2026, point 4). */
export const TOAST_MS = 4_200;

/**
 * A toast (mockup components.html 08): one line saying what just happened, with one button at
 * most. `detail` is a few lighter words after the text ("· Thứ Hai 28/09/2026 14:00"). An `error`
 * stays until it is closed; any other leaves after `TOAST_MS`.
 */
export interface ToastSpec {
  readonly text: string;
  readonly detail?: string;
  readonly tone?: 'done' | 'info' | 'error';
  readonly action?: { readonly label: string; readonly run: () => void };
}

/** What a screen shows a toast through (`useToast`). */
export interface Toaster {
  show(toast: ToastSpec): void;
}

/** The toast of the window: one at a time, a new one taking the place of the one shown. */
export interface ToastQueue extends Toaster {
  current(): ToastSpec | null;
  /** Runs the action of the toast shown, then closes that toast: not one the action showed. */
  act(): void;
  dismiss(): void;
  /** Called as the toast changes, before anything renders it; returns how to leave. */
  subscribe(listener: () => void): () => void;
}

export function createToastQueue(): ToastQueue {
  const listeners = new Set<() => void>();
  let shown: ToastSpec | null = null;
  let leaving: ReturnType<typeof setTimeout> | undefined;

  const set = (toast: ToastSpec | null) => {
    clearTimeout(leaving);
    leaving = undefined;
    if (shown === toast) return;
    shown = toast;
    if (toast && toast.tone !== 'error') leaving = setTimeout(() => set(null), TOAST_MS);
    // A listener's bug must not keep the toast from changing, nor the others from hearing of it.
    notify(listeners, console.error);
  };

  return {
    show: (toast) => set({ ...toast }),
    current: () => shown,
    act() {
      const toast = shown;
      if (!toast?.action) return;
      toast.action.run();
      if (shown === toast) set(null);
    },
    dismiss: () => set(null),
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}
