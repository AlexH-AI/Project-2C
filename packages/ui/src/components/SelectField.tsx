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
  /** Marks the label with *; the command, not the browser, rejects an empty value. */
  required?: boolean;
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
  required,
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
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
        onChange={(event) => onChange(event.target.value)}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`cursor-pointer rounded-md border bg-surface-0 px-2 py-1.5 text-sm text-fg focus-visible:outline-2 focus-visible:outline-accent ${
          error ? 'border-danger' : 'border-border-strong'
        }`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
