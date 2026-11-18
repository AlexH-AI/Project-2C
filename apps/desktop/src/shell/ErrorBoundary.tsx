import { Component, type ReactNode } from 'react';
import { StateNote } from '@p2c/ui';
import { t } from '../i18n';
import { screenErrorMessage } from './screen-error';

type State = { failed: false } | { failed: true; error: unknown };

interface Props {
  /**
   * A failed screen renders again when this changes (compared by identity). The shell passes the
   * scope object, which is rebuilt both when the topbar pick changes and when the teams or people
   * behind it are read again (e.g. after a save), so the screen may retry without a new pick.
   * A screen that did not fail keeps its state.
   */
  resetKey: unknown;
  children: ReactNode;
}

/**
 * Catches a render error of the current screen (T-077): React would otherwise unmount the whole
 * tree and leave a blank window. Sidebar and topbar sit outside it and keep working; the shell
 * keys it by route, so moving to another screen renders that screen afresh. The error of one
 * screen, in the shape of every empty place and error (mockup components.html 10).
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
      <StateNote
        size="screen"
        tone="error"
        icon="alert"
        heading={2}
        title={title}
        next={help}
        detail={{ label: t('storage.technicalDetail'), text: detail }}
      />
    );
  }
}
