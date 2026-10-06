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
 * `autoFocus` also marks it for `Dialog`, which focuses it once open.
 */
export function Button({ variant = 'default', type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-autofocus={props.autoFocus || undefined}
      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-50 ${VARIANTS[variant]} ${className ?? ''}`}
      {...props}
    />
  );
}
