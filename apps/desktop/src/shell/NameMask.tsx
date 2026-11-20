import { useSyncExternalStore } from 'react';
import { t } from '../i18n';
import { maskName, nameMask as mask } from './name-mask';
import { useToast } from './Toasts';

/**
 * Whether customer names are masked, and how to change it (mockup app-shell.html `#privacy`):
 * every screen that shows a customer's name or a text typed about one changes at once.
 */
export function useNameMask(): { masked: boolean; toggle(): void } {
  const masked = useSyncExternalStore(mask.subscribe, mask.masked, mask.masked);
  return { masked, toggle: () => mask.set(!mask.masked()) };
}

/**
 * What stands for a customer while the mask is on, where only a string goes (the title of a
 * dialog, a slot of a sentence): `name` the first letters, `text` the dots. Search, sorting, the
 * Excel file, a backup and a field being typed in keep reading the real ones.
 */
export interface Masked {
  name(full: string): string;
  text(typed: string): string;
}

export function useMasked(): Masked {
  const { masked } = useNameMask();
  return {
    name: (full) => (masked ? maskName(full) : full),
    text: (typed) => (masked && typed ? t('nameMask.dots') : typed),
  };
}

/** A customer's name, or its first letters ("N. V. H.") while the mask is on; never the code. */
export function CustomerName({ name }: { name: string }) {
  return useMasked().name(name);
}

/**
 * Text a user typed, or the AI wrote, about a customer (a note, the trigger of a meeting, a KYC
 * fact in words, an analysis): it may hold a name, so while the mask is on the whole of it shows
 * as dots, which a screen reader reads as "đã ẩn", never the text.
 */
export function TypedText({ text }: { text: string }) {
  const { masked } = useNameMask();
  if (!masked || !text) return text;
  // --text-2, not the mockup's --text-3: on the glass of macOS --text-3 is below 4.5:1.
  return (
    <span className="text-fg-2 italic">
      <span aria-hidden="true">{t('nameMask.dots')}</span>
      <span className="sr-only">{t('nameMask.hidden')}</span>
    </span>
  );
}

/** The eye of the mockup (`#i-eye`, `#i-eye-off`), as one path each. */
const EYE = {
  open: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM15 12a3 3 0 1 1-6 0a3 3 0 1 1 6 0z',
  shut: 'M9.5 6c.8-.3 1.6-.5 2.5-.5 6 0 9.5 6.5 9.5 6.5s-1 1.9-3 3.7M14.5 18.1c-.8.3-1.6.4-2.5.4-6 0-9.5-6.5-9.5-6.5s1.3-2.4 3.8-4.3M4 4l16 16M9.9 9.9a3 3 0 0 0 4.2 4.2',
};

const BOX =
  'press inline-flex h-8.5 flex-none cursor-pointer items-center justify-center gap-1.5 rounded-control text-md whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/**
 * The button of the mask, first on the right of the toolbar on every screen (mockup app-shell.html
 * `#privacy`, "Nút chạy thế nào"): an eye; once on, gold and saying so until it is off again. A
 * toast says what one click did.
 */
export function NameMaskButton() {
  const { masked, toggle } = useNameMask();
  const toast = useToast();
  return (
    <button
      type="button"
      aria-pressed={masked}
      aria-label={t('nameMask.button')}
      title={t(masked ? 'nameMask.onTitle' : 'nameMask.button')}
      onClick={() => {
        toggle();
        toast.show(
          masked
            ? { text: t('nameMask.offToast') }
            : { text: t('nameMask.onToast'), detail: t('nameMask.onToastDetail'), tone: 'info' },
        );
      }}
      className={`${BOX} ${masked ? 'btn-quiet bg-accent-soft pr-3 pl-2.5 inset-ring inset-ring-accent/45' : 'btn-default w-8.5'}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0"
      >
        <path d={masked ? EYE.shut : EYE.open} />
      </svg>
      {masked && t('nameMask.on')}
    </button>
  );
}
