import { useId } from 'react';
import { fieldNotes, type FieldNote } from './field-notes';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown under the field and read as its description. */
  error?: string;
  /**
   * What the app understood from the text (mockup `.read`), shown under the field and read as its
   * description while there is no error.
   */
  hint?: string;
  /**
   * How to fill the field in (mockup 6d), shown last under it whatever was typed, and read as part
   * of its description.
   */
  help?: string;
  /** Marks the label with *; the command, not the browser, rejects an empty value. */
  required?: boolean;
  disabled?: boolean;
  /** Also marks the field for `Dialog`, which focuses it once open. */
  autoFocus?: boolean;
  /** A multi-line box of this many rows instead of a one-line input. */
  rows?: number;
  /** Shown in the empty field (mockup `.input.placeholder`). */
  placeholder?: string;
  /** `password` hides what is typed or pasted, as for a secret; one-line fields only. */
  type?: 'text' | 'password';
  /** Off for what is no words, such as a key. */
  spellCheck?: boolean;
}

const NOTE_CLASS = {
  error: 'text-xs text-danger',
  read: 'text-xs text-fg-2 tabular-nums',
  help: 'text-xs text-fg-3',
} as const satisfies Record<FieldNote['tone'], string>;

/**
 * Labelled text input (mockup `.field`), one line unless `rows` is set, with its error, or what the
 * app read, and its help under it.
 */
export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  help,
  required,
  disabled,
  autoFocus,
  rows,
  placeholder,
  type,
  spellCheck,
}: TextFieldProps) {
  const id = useId();
  const { notes, describedBy } = fieldNotes(id, { error, hint, help });
  const Input = rows ? 'textarea' : 'input';
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' *'}
          </span>
        )}
      </label>
      <Input
        id={id}
        rows={rows}
        type={rows ? undefined : type}
        spellCheck={spellCheck}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        autoFocus={autoFocus}
        data-autofocus={autoFocus || undefined}
        autoComplete="off"
        className={`rounded-md border bg-surface-0 px-2 py-1.5 text-fg placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-accent ${
          error ? 'border-danger' : 'border-border-control'
        }`}
      />
      {notes.map((note) => (
        <span key={note.tone} id={note.id} className={NOTE_CLASS[note.tone]}>
          {note.text}
        </span>
      ))}
    </div>
  );
}
