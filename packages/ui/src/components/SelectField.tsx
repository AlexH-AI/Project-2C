import { useId, useState } from 'react';
import { ErrorMark, ListArrow } from './FieldMarks';

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
  /** Shown but not changeable (mockup `.input.locked`: a dashed edge, no fill). */
  disabled?: boolean;
  /**
   * Never wider than `max-w-80`, for a picker in a toolbar: a longer choice is cut there, so a long
   * name does not push the toolbar out of the window, and is read whole from the field's title
   * under the pointer (DR6-170).
   */
  capped?: boolean;
}

/**
 * Labelled drop-down list, with its error under it. Closed, it is the box of a text field with an
 * arrow (mockup components.html 03 "Ô chọn: đóng"); open, its list is the system's own, which keeps
 * its keyboard and what a screen reader says of it (Owner 17/11/2026).
 */
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
  // The title is there only under the pointer, which it is for: kept on the field it would be its
  // description too, and a screen reader would say the choice twice (DR6-187).
  const [pointed, setPointed] = useState(false);
  return (
    <div className={capped ? 'flex min-w-0 max-w-80 flex-col gap-1' : 'flex flex-col gap-1'}>
      <label htmlFor={id} className={labelHidden ? 'sr-only' : 'font-medium'}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' *'}
          </span>
        )}
      </label>
      {/* Layout containment around every list, capped or held narrower from outside (a box of a
          bar, a dialog): the choice shown is cut in the field, and WebKit counts the cut text in
          the scrolling width of whatever holds the field, up to the page (Mac-7b, VA2). */}
      <div className="relative flex flex-col contain-layout">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onPointerEnter={capped ? () => setPointed(true) : undefined}
          onPointerLeave={capped ? () => setPointed(false) : undefined}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || help ? noteId : undefined}
          title={
            capped && pointed ? options.find((option) => option.value === value)?.label : undefined
          }
          className={`field min-h-9 cursor-pointer appearance-none rounded-field py-1.5 pr-8 pl-2.75 disabled:cursor-default ${size === 'md' ? 'text-md' : 'text-sm'}`}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ListArrow />
      </div>
      {error ? (
        <span id={noteId} className="text-xs text-danger">
          <ErrorMark />
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
