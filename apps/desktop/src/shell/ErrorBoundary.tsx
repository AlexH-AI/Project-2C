import { Component, type ReactNode } from 'react';
import { t } from '../i18n';
import { screenErrorMessage } from './screen-error';

type State = { failed: false } | { failed: true; error: unknown };

interface Props {
  /**
   * A failed screen renders again when this changes (compared by identity), e.g. the scope picked
   * in the topbar. A screen that did not fail keeps its state.
   */
  resetKey: unknown;
  children: ReactNode;
}

/**
 * Catches a render error of the current screen (T-077): React would otherwise unmount the whole
 * tree and leave a blank window. Sidebar and topbar sit outside it and keep working; the shell
 * keys it by route, so moving to another screen renders that screen afresh.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, error };
  }

  override componentDidUpdate(previous: Props): void {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    const { title, help, detail } = screenErrorMessage(this.state.error);
    return (
      <section role="alert" className="flex flex-col gap-2">
        <h2 className="m-0 text-base font-semibold text-danger">{title}</h2>
        <p className="m-0 text-sm text-fg-2">{help}</p>
        <p className="m-0 text-sm text-fg-2">
          {t('storage.technicalDetail')} <code>{detail}</code>
        </p>
      </section>
    );
  }
}
