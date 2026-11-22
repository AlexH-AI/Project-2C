import { useId, type ReactNode } from 'react';
import { describedBy as describedByAll } from './field-notes';

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
  /** The id of a line outside the group that describes it too, read before its help. */
  describedBy?: string;
}

/**
 * Labelled row of radio pills (mockup components.html 03 "Viên chọn", each a `.choice`: gold with a
 * heavier edge when on; struck out when it cannot be picked); arrow keys move between the enabled
 * ones. A radio group rather than a plain group, so `required` reaches assistive technology as
 * `aria-required`.
 */
export function Choices<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  help,
  describedBy,
}: ChoicesProps<T>) {
  const name = useId();
  return (
    <fieldset
      role="radiogroup"
      className="m-0 flex flex-col gap-1 border-0 p-0"
      aria-required={required}
      aria-describedby={describedByAll(describedBy, help && `${name}-help`)}
    >
      <legend className="field-label mb-1 p-0">
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent">
            {' *'}
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="choice press relative inline-flex min-h-7.5 cursor-pointer items-center gap-1.5 rounded-chip px-3 text-sm has-disabled:cursor-default has-disabled:line-through has-disabled:opacity-40 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
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
