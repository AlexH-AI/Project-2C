import type { ButtonHTMLAttributes } from 'react';

const VARIANTS = {
  default: 'border border-border bg-surface-2 text-fg hover:bg-surface-3',
  primary: 'border border-accent bg-accent text-on-accent hover:opacity-90',
  danger: 'border border-danger bg-danger text-on-accent hover:opacity-90',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * Mockup `.btn` / `.btn-primary` / `.btn-danger`; `type` defaults to "button", not "submit".
 * `autoFocus` also marks it for `Dialog`, which focuses it once open. Off by `aria-disabled`, which
 * keeps the focus (DR6-154), it looks as off by `disabled`.
 */
export function Button({
  variant = 'default',
  type = 'button',
  className,
  onMouseDown,
  ...props
}: ButtonProps) {
  const off = props['aria-disabled'] === true || props['aria-disabled'] === 'true';
  return (
    <button
      type={type}
      data-autofocus={props.autoFocus || undefined}
      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50 ${VARIANTS[variant]} ${className ?? ''}`}
      {...props}
      onMouseDown={(event) => {
        // Off, it keeps the focus it holds when clicked. On macOS a click gives a button no focus
        // and takes it off what had it, this button too (WebKit, as Safari; Mac-7b); Windows gives
        // it back to the button the click is on.
        if (off && event.currentTarget === event.currentTarget.ownerDocument.activeElement) {
          event.preventDefault();
        }
        onMouseDown?.(event);
      }}
    />
  );
}
