import { useId, type ReactNode } from 'react';

export interface Choice<T extends string> {
  value: T;
  label: ReactNode;
  /** Shown but not selectable (mockup `.choice.off`). */
  disabled?: boolean;
}

interface ChoicesProps<T extends string> {
  label: string;
  options: ReadonlyArray<Choice<T>>;
  /** Null while nothing is picked. */
  value: T | null;
  onChange: (value: T) => void;
  required?: boolean;
  /** Under the choices, e.g. why some are not selectable. */
  help?: string;
}

/**
 * Labelled row of radio chips (mockup `.choices`); arrow keys move between the enabled ones. A radio
 * group rather than a plain group, so `required` reaches assistive technology as `aria-required`.
 */
export function Choices<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  help,
}: ChoicesProps<T>) {
  const name = useId();
  return (
    <fieldset
      role="radiogroup"
      className="m-0 flex flex-col gap-1 border-0 p-0"
      aria-required={required}
      aria-describedby={help && `${name}-help`}
    >
      <legend className="mb-1 p-0 font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' *'}
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface-0 px-2.5 py-1 has-checked:border-accent has-checked:bg-accent-soft has-disabled:cursor-default has-disabled:opacity-50 has-focus-visible:outline-2 has-focus-visible:outline-accent"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-default"
            />
            {option.label}
          </label>
        ))}
      </div>
      {help && (
        <span id={`${name}-help`} className="text-xs text-fg-3">
          {help}
        </span>
      )}
    </fieldset>
  );
}
