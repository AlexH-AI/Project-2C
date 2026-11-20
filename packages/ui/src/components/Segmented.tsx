import { useRef, type KeyboardEvent } from 'react';
import { useGlide } from './motion-hooks';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  label: string;
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

/**
 * Single-choice button group (ADR-0013 "segmented"; mockup components.html 03 "Nút trượt"): a radio
 * group with arrow-key support. The chosen segment says so by its thumb, an element of its own
 * under every label, and by its brighter text. The thumb is drawn in the segment chosen, as wide as
 * it at once, and glides there from the one before (VA7a, `glide`).
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  const group = useRef<HTMLDivElement>(null);
  useGlide(
    value,
    (chosen) =>
      group.current?.querySelectorAll<HTMLElement>('[role="radio"]')[
        options.findIndex((option) => option.value === chosen)
      ],
    'thumb',
  );
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const next = options[(index + step + options.length) % options.length];
    if (!next) return;
    onChange(next.value);
    const buttons = event.currentTarget.querySelectorAll('button');
    buttons[(index + step + options.length) % options.length]?.focus();
  };

  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="isolate inline-flex gap-0.5 rounded-segmented bg-fill-2 p-0.5"
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`relative h-7 cursor-pointer rounded-control-sm px-3 text-sm font-control whitespace-nowrap transition-colors duration-(--t-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              checked ? 'text-fg' : 'text-fg-2 hover:text-fg'
            }`}
          >
            {checked && (
              <span
                aria-hidden="true"
                data-slot="thumb"
                className="thumb absolute inset-0 -z-1 rounded-control-sm"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
