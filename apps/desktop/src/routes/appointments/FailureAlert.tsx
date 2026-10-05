import type { ReactNode } from 'react';
import { ALERT } from '../customers/CustomerDialogs';

/** The red box a dialog shows when saving failed or its form cannot be read. */
export function FailureAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className={`${ALERT} border-danger text-danger`}>
      {children}
    </p>
  );
}
