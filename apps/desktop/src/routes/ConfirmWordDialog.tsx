import { useEffect, useId, useState, type ReactNode } from 'react';
import { Button, Dialog, TextField } from '@p2c/ui';
import { t } from '../i18n';

/**
 * The button of a dialog that runs what it confirms (10a, 10c, 11i). While it runs it says so and
 * takes the focus, off by `aria-disabled` rather than `disabled`: the field or button the focus was
 * on goes off, and the focus would fall to the page, out of reach of Tab, with nothing saying what
 * runs (DR6-154). Pressed then, it submits still: the dialog's `onSubmit` runs nothing while it runs.
 */
export function ConfirmButton({
  label,
  runningLabel,
  running,
  disabled = false,
}: {
  label: string;
  runningLabel: string;
  running: boolean;
  /** Off before it runs, e.g. until the word is typed. */
  disabled?: boolean;
}) {
  const id = useId();
  useEffect(() => {
    if (running) document.getElementById(id)?.focus();
  }, [running, id]);
  return (
    <Button
      id={id}
      type="submit"
      variant="danger"
      disabled={disabled && !running}
      aria-disabled={running || undefined}
      className="aria-disabled:cursor-default aria-disabled:opacity-50"
    >
      {running ? runningLabel : label}
    </Button>
  );
}

/**
 * A dialog confirmed by typing a word (mockups 10c, 11i), for what replaces or deletes data for
 * good: Nạp lại dữ liệu giả lập, Dọn sạch Thùng rác. Each passes only its body, the word, the labels
 * of its button and what the button runs, which closes the dialog whichever way it went. The word
 * counts once composed: an IME may type it decomposed (review R4). While it runs nothing closes the
 * dialog or runs it again: Escape, Hủy and the field are off, the button too, holding the focus.
 */
export function ConfirmWordDialog({
  title,
  subtitle,
  word,
  confirmLabel,
  runningLabel,
  run,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  word: string;
  confirmLabel: string;
  /** The button's label while `run` runs. */
  runningLabel: string;
  run: () => Promise<void>;
  /** Hủy or Escape, before it runs. */
  onClose: () => void;
  children: ReactNode;
}) {
  const [typed, setTyped] = useState('');
  const [running, setRunning] = useState(false);
  const confirmed = typed.normalize('NFC') === word;

  return (
    <Dialog
      title={title}
      subtitle={subtitle}
      onClose={running ? undefined : onClose}
      onSubmit={() => {
        if (!confirmed || running) return;
        setRunning(true);
        void run();
      }}
      actions={
        <>
          <Button disabled={running} onClick={onClose}>
            {t('settings.demo.cancel')}
          </Button>
          <ConfirmButton
            label={confirmLabel}
            runningLabel={runningLabel}
            running={running}
            disabled={!confirmed}
          />
        </>
      }
    >
      {children}
      <TextField
        label={t('settings.demo.confirmWordLabel', { word })}
        value={typed}
        disabled={running}
        onChange={setTyped}
      />
    </Dialog>
  );
}
