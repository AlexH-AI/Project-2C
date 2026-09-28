import { useId } from 'react';

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
  /** Marks the label with *; the command, not the browser, rejects an empty value. */
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

/** Labelled one-line text input (mockup `.field`), with its error under it. */
export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  autoFocus,
}: TextFieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
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
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? noteId : undefined}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        className={`rounded-md border bg-surface-0 px-2 py-1.5 text-fg focus-visible:outline-2 focus-visible:outline-accent ${
          error ? 'border-danger' : 'border-border-strong'
        }`}
      />
      {error ? (
        <span id={noteId} className="text-xs text-danger">
          {error}
        </span>
      ) : (
        hint && (
          <span id={noteId} className="text-xs text-fg-2 tabular-nums">
            {hint}
          </span>
        )
      )}
    </div>
  );
}
