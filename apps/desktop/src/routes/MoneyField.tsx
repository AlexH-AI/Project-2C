import { useRef, type ComponentProps } from 'react';
import { TextField } from '@p2c/ui';
import { t } from '../i18n';
import { FOCUS } from './classes';
import { moneyPlaceholder, type FieldRefusal } from './money-view';

const SUGGESTION = `inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-accent px-2 py-0.5 font-semibold text-accent hover:bg-accent-soft ${FOCUS}`;

/**
 * A money field (mockup ngon-ngu-tien-te.html #money): the example of how to type an amount when
 * empty, the sentence of a refusal, and under it the ways of writing that read, each a button that
 * fills the field (Q11); the app never fills one itself. What the field reads (`hint`) and what is
 * refused (`refusal`, from `moneyRefusal`) come from the form.
 */
export function MoneyField({
  refusal,
  onChange,
  ...field
}: Omit<ComponentProps<typeof TextField>, 'error' | 'placeholder'> & {
  refusal?: FieldRefusal;
}) {
  const box = useRef<HTMLDivElement>(null);
  // The button goes once the field reads: the focus goes back to the field it filled.
  const fill = (text: string) => {
    onChange(text);
    box.current?.querySelector('input')?.focus();
  };
  const offered = refusal?.suggestions ?? [];
  return (
    <div ref={box} className="flex flex-col gap-1">
      <TextField
        {...field}
        onChange={onChange}
        error={refusal?.message}
        placeholder={moneyPlaceholder()}
      />
      {offered.length > 0 && (
        <div
          role="group"
          aria-label={refusal?.lead}
          className="flex flex-wrap items-center gap-1.5 text-xs text-fg-2 tabular-nums"
        >
          <span aria-hidden="true">{refusal?.lead}</span>
          {offered.map((suggestion) => (
            <button
              key={suggestion.text}
              type="button"
              className={SUGGESTION}
              aria-label={suggestion.label}
              onClick={() => fill(suggestion.text)}
            >
              {suggestion.text}{' '}
              <span className="font-normal text-fg-2">
                {t('sep.equals')} {suggestion.read}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
