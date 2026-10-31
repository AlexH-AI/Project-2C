import type { AiAbortSignal } from '@p2c/ai';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  keptFailures,
  type AiCall,
  type AnalysisOutcome,
  type ExtractionOutcome,
} from '../../data/ai-analysis';
import { useAppData } from '../../data/AppDataContext';
import type { AiJobPhase } from './ai-panel-view';

/** What each kind of run ends with; the kind is the prefix of its key, `<kind>:<id>`. */
interface AiJobOutcomes {
  readonly analysis: AnalysisOutcome;
  readonly extraction: ExtractionOutcome;
}

/**
 * A run the app keeps (`AiJobs`) under `<kind>:<id>`: its phase, also on a screen shown again while
 * it runs (review of PR 439), and how it ended while the screen stays; a failure the screen was
 * gone for is said once it is shown again (T-297), unless the data was replaced since (DR6-144).
 * Hủy's ending is never kept: once the request after it ends, the screen is back as it was.
 */
export function useAiJob<K extends keyof AiJobOutcomes>(kind: K, id: string) {
  type Outcome = AiJobOutcomes[K];
  const key = `${kind}:${id}`;
  const app = useAppData();
  const { ai } = app;
  const { jobs } = ai;
  const job = useSyncExternalStore(jobs.subscribe, () => jobs.get(key));
  // Only `start` below puts a job under this key, so what it kept is this kind's outcome.
  const kept = useSyncExternalStore(jobs.subscribe, () => jobs.kept(key)) as Outcome | undefined;
  const [ended, setEnded] = useState<Outcome | null>(null);
  // Held here as if it had ended while shown, and dropped from `AiJobs` once shown: said once.
  if (kept && kept !== ended) setEnded(kept);
  useEffect(() => {
    if (kept) jobs.drop(key);
  }, [jobs, key, kept]);
  useEffect(() => {
    // A job that rejects is a bug `AiJobs` has reported already.
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
    /** The settings the running request was started with (DR5-31). */
    settings: job?.settings,
    ended,
    /** `run` gets the call taken now, so what runs is what the screen says runs. */
    start(run: (signal: AiAbortSignal, call: AiCall) => Promise<Outcome>) {
      setEnded(null);
      const call = ai.call();
      // `AiJobs` handles how `done` ends, a rejection too.
      void jobs.start(key, (signal) => run(signal, call), call.settings, keptFailures(app));
    },
    cancel: () => jobs.cancel(key),
    /** Back to nothing shown: Đóng, or another run of the screen starting. */
    clear: () => setEnded(null),
  };
}
