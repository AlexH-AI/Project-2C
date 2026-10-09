/**
 * The read-only AI block of the appointment detail (spec Phase 5 §9.2, mockup appointments.html):
 * what the customer's latest ACCEPTED analysis says to do next. Pure, so the block only lays it out.
 */
import type { AiAnalysisView } from '@p2c/db';
import type { CalendarDate } from '@p2c/domain';
import { analysisContent, type AiPanelItem } from '../customers/ai-panel-view';

export interface AppointmentAiView {
  readonly state: 'CURRENT' | 'STALE';
  readonly gateState: AiAnalysisView['gateState'];
  readonly mock: boolean;
  /** The KYC version analysed, "v<n>". */
  readonly version: number;
  /** The app day it was saved. */
  readonly date: CalendarDate;
  readonly nextBestActions: readonly AiPanelItem[];
  readonly discoveryStrategy: readonly AiPanelItem[];
}

/** Null when the customer has no ACCEPTED analysis: a REJECTED row is never shown as a result. */
export function appointmentAiView(
  /** `listAiAnalyses`: latest first. */
  analyses: readonly AiAnalysisView[],
  versions: readonly { readonly id: string }[],
): AppointmentAiView | null {
  const shown = analyses.find((analysis) => analysis.status === 'ACCEPTED');
  if (!shown) return null;
  const content = analysisContent(shown, versions);
  const items = (key: 'nextBestActions' | 'discoveryStrategy') =>
    content.sections.find((section) => section.key === key)?.groups[0]?.items ?? [];
  return {
    state: shown.state === 'CURRENT' ? 'CURRENT' : 'STALE',
    gateState: shown.gateState,
    mock: shown.provider === 'MOCK',
    version: content.chip.version,
    date: shown.date,
    nextBestActions: items('nextBestActions'),
    discoveryStrategy: items('discoveryStrategy'),
  };
}
