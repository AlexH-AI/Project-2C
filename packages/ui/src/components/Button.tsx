import type { ButtonHTMLAttributes } from 'react';
import { NavIcon, type NavIconName } from './NavIcon';

/** The paint of each level and its states (theme.css `btn-*`). */
const VARIANTS = {
  default: 'btn-default',
  primary: 'btn-primary',
  danger: 'btn-danger',
  quiet: 'btn-quiet',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `default` is the secondary button; a region has one `primary`; `quiet` is text alone. */
  variant?: ButtonVariant;
  /**
   * `sm` is the compact button of a card, a table row or a banner: 28 px, not 34; `icon` a square
   * of 34 px (`IconButton`).
   */
  size?: 'md' | 'sm' | 'icon';
}

/**
 * Mockup components.html 01 (`.btn`, `.primary`, `.danger`, `.quiet`, `.sm`): one height, one
 * press, the corner of the system; `type` defaults to "button", not "submit". `autoFocus` also
 * marks it for `Dialog`, which focuses it once open. Off by `aria-disabled`, which keeps the focus
 * (DR6-154), it looks as off by `disabled`.
 */
export function Button({
  variant = 'default',
  size = 'md',
  type = 'button',
  className,
  onMouseDown,
  ...props
}: ButtonProps) {
  const off = props['aria-disabled'] === true || props['aria-disabled'] === 'true';
  const box =
    size === 'sm'
      ? 'h-7 rounded-control-sm px-2.75 text-sm'
      : size === 'icon'
        ? 'size-8.5 rounded-control text-md'
        : `h-8.5 rounded-control text-md ${variant === 'quiet' ? 'px-2.5' : 'px-3.5'}`;
  return (
    <button
      type={type}
      data-autofocus={props.autoFocus || undefined}
      className={`press inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 ${box} ${VARIANTS[variant]} ${className ?? ''}`}
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

/**
 * A button named by its icon alone (mockup app-shell.html `.btn.icon`): the magnifier of the
 * toolbar, the eye of the mask of names. A square of 34 px, `label` its name and its tooltip. One
 * that stays `on` until pressed again (`aria-pressed`) says so in gold, with `children`, the words
 * after its icon (`#privacy`, `.btn.icon[data-mask].is-on`).
 */
export function IconButton({
  icon,
  label,
  on,
  children,
  className,
  ...props
}: Omit<ButtonProps, 'variant' | 'size' | 'aria-pressed'> & {
  icon: NavIconName;
  label: string;
  on?: boolean;
}) {
  return (
    <Button
      title={label}
      {...props}
      variant={on ? 'quiet' : 'default'}
      size={children ? 'md' : 'icon'}
      aria-label={label}
      aria-pressed={on}
      className={`flex-none ${on ? 'bg-accent-soft pr-3 inset-ring inset-ring-accent/45' : ''} ${className ?? ''}`}
    >
      <NavIcon name={icon} className="size-4" />
      {children}
    </Button>
  );
}
