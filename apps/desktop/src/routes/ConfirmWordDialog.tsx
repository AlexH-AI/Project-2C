import { useState, type ReactNode } from 'react';
import { Button, Dialog, TextField } from '@p2c/ui';
import { t } from '../i18n';

/**
 * A dialog confirmed by typing a word (mockups 10c, 11i), for what replaces or deletes data for
 * good: Nạp lại dữ liệu giả lập, Dọn sạch Thùng rác. Each passes only its body, the word, the labels
 * of its button and what the button runs, which closes the dialog whichever way it went. The word
 * counts once composed: an IME may type it decomposed (review R4). While it runs nothing closes the
 * dialog or runs it again: Escape, Hủy and the button are off.
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
          <Button type="submit" variant="danger" disabled={!confirmed || running}>
            {running ? runningLabel : confirmLabel}
          </Button>
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
