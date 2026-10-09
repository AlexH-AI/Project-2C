import type { AiAbortSignal } from '@p2c/ai';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { AnalysisOutcome, ExtractionOutcome } from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import type { AiJobPhase } from './ai-panel-view';

/** What each kind of run ends with; the kind is the prefix of its key, `<kind>:<id>`. */
interface AiJobOutcomes {
  readonly analysis: AnalysisOutcome;
  readonly extraction: ExtractionOutcome;
}

/**
 * A run the app keeps (`AiJobs`) under `<kind>:<id>`: its phase, also on a screen shown again while
 * it runs (review of PR 439), and how it ended while the screen stays. Hủy's ending is never kept:
 * once the request after it ends, the screen is back as it was.
 */
export function useAiJob<K extends keyof AiJobOutcomes>(kind: K, id: string) {
  type Outcome = AiJobOutcomes[K];
  const key = `${kind}:${id}`;
  const { jobs } = useAppData().ai;
  const job = useSyncExternalStore(jobs.subscribe, () => jobs.get(key));
  const [ended, setEnded] = useState<Outcome | null>(null);
  useEffect(() => {
    // Only `start` below puts a job under this key, so it ends with this kind's outcome. A job
    // that rejects is a bug `AiJobs` has reported already.
    job?.done.then(
      (outcome) => {
        const done = outcome as Outcome;
        if (done.kind !== 'cancelled') setEnded(done);
      },
      () => undefined,
    );
  }, [job]);
  const phase: AiJobPhase = job ? (job.cancelled ? 'cancelling' : 'running') : 'idle';
  return {
    phase,
    ended,
    start(run: (signal: AiAbortSignal) => Promise<Outcome>) {
      setEnded(null);
      // `AiJobs` handles how `done` ends, a rejection too.
      void jobs.start(key, run);
    },
    cancel: () => jobs.cancel(key),
    /** Back to nothing shown: Đóng, or another run of the screen starting. */
    clear: () => setEnded(null),
  };
}
