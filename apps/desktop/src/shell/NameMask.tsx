import { useSyncExternalStore } from 'react';
import { IconButton } from '@p2c/ui';
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
 * as dots, which a screen reader reads as "đã ẩn", never the text. On a chosen row the gold tint
 * writes them in --text (`chosen-tint`, review of PR 1418).
 */
export function TypedText({ text }: { text: string }) {
  const { masked } = useNameMask();
  if (!masked || !text) return text;
  // --text-2, not the mockup's --text-3: chosen in VA6a, when --text-3 was below 4.5:1 on the glass
  // of macOS (it reads 4.5:1 on a card since review of PR 1418).
  return (
    <span className="text-fg-2 italic">
      <span aria-hidden="true">{t('nameMask.dots')}</span>
      <span className="sr-only">{t('nameMask.hidden')}</span>
    </span>
  );
}

/**
 * Masks the names, or shows them again, and a toast says what was done: the eye of the toolbar,
 * and "Che / hiện tên khách hàng" of the command bar (VA8).
 */
export function useMaskToggle(): () => void {
  const { masked, toggle } = useNameMask();
  const toast = useToast();
  return () => {
    toggle();
    toast.show(
      masked
        ? { text: t('nameMask.offToast') }
        : { text: t('nameMask.onToast'), detail: t('nameMask.onToastDetail'), tone: 'info' },
    );
  };
}

/**
 * The button of the mask, first on the right of the toolbar on every screen (mockup app-shell.html
 * `#privacy`, "Nút chạy thế nào"): an eye; once on, gold and saying so until it is off again. A
 * toast says what one click did.
 */
export function NameMaskButton() {
  const { masked } = useNameMask();
  const onClick = useMaskToggle();
  return (
    <IconButton
      icon={masked ? 'eyeOff' : 'eye'}
      label={t('nameMask.button')}
      title={t(masked ? 'nameMask.onTitle' : 'nameMask.button')}
      on={masked}
      onClick={onClick}
    >
      {masked && t('nameMask.on')}
    </IconButton>
  );
}
