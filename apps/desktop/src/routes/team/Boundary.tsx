import { Component, type ReactNode } from 'react';

type State = { readonly failed: false } | { readonly failed: true; readonly error: unknown };

/**
 * What a part of the RM page shows when rendering it threw (mockup search-rm-team.html `#states`):
 * the page as a whole in place of the shell's note (L232), or the strip "Nhịp gặp · 8 tuần" in its
 * card, the four numbers above it still there. `retry` renders the part again.
 */
export class Boundary extends Component<
  { fallback: (error: unknown, retry: () => void) => ReactNode; children: ReactNode },
  State
> {
  override state: State = { failed: false };

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, error };
  }

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return this.props.fallback(this.state.error, () => this.setState({ failed: false }));
  }
}
