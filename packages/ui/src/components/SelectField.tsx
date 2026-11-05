import { useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  /** The label is read by screen readers only (a compact picker in a toolbar). */
  labelHidden?: boolean;
  /** An empty first choice, shown while nothing is picked. */
  placeholder?: string;
  /** Shown under the field and read as its description. */
  error?: string;
  /** Under the field while there is no error, read as its description. */
  help?: string;
  /** Marks the label with *; the command, not the browser, rejects an empty value. */
  required?: boolean;
  /** `md` is the larger text of a topbar picker; `sm` (default) is the usual size. */
  size?: 'sm' | 'md';
  /** Shown but not changeable (mockup `.input.off`). */
  disabled?: boolean;
  /**
   * Never wider than `max-w-80`, for a picker in a toolbar: a longer choice is cut there, so a long
   * name does not push the toolbar out of the window, and is read whole from the field's title
   * (DR6-170).
   */
  capped?: boolean;
}

/** Labelled drop-down list (mockup `.field` with a caret), with its error under it. */
export function SelectField({
  label,
  value,
  options,
  onChange,
  labelHidden,
  placeholder,
  error,
  help,
  required,
  size = 'sm',
  disabled,
  capped,
}: SelectFieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  return (
    <div className={`flex flex-col gap-1 ${capped ? 'min-w-0 max-w-80' : ''}`}>
      <label htmlFor={id} className={labelHidden ? 'sr-only' : 'font-medium'}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' *'}
          </span>
        )}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? noteId : undefined}
        title={capped ? options.find((option) => option.value === value)?.label : undefined}
        className={`cursor-pointer rounded-md disabled:cursor-default disabled:opacity-50 border bg-surface-0 px-2 py-1.5 ${size === 'md' ? 'text-md' : 'text-sm'} text-fg focus-visible:outline-2 focus-visible:outline-accent ${
          error ? 'border-danger' : 'border-border-control'
        }`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={noteId} className="text-xs text-danger">
          {error}
        </span>
      ) : (
        help && (
          <span id={noteId} className="text-xs text-fg-3">
            {help}
          </span>
        )
      )}
    </div>
  );
}
