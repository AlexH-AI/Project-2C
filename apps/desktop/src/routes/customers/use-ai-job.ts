import type { AiAbortSignal } from '@p2c/ai';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useAppData } from '../../data/AppDataContext';
import type { AiJobPhase } from './ai-panel-view';

/**
 * A run the app keeps under `key` (`AiJobs`): its phase, also on a screen shown again while it runs
 * (review of PR 439), and how it ended while the screen stays. Hủy's ending is never kept: once the
 * request after it ends, the screen is back as it was.
 */
export function useAiJob<T extends { readonly kind: string }>(key: string) {
  const { jobs } = useAppData().ai;
  const job = useSyncExternalStore(jobs.subscribe, () => jobs.get(key));
  const [ended, setEnded] = useState<T | null>(null);
  useEffect(() => {
    void job?.done.then((outcome) => {
      const done = outcome as T;
      if (done.kind !== 'cancelled') setEnded(done);
    });
  }, [job]);
  const phase: AiJobPhase = job ? (job.cancelled ? 'cancelling' : 'running') : 'idle';
  return {
    phase,
    ended,
    start(run: (signal: AiAbortSignal) => Promise<T>) {
      setEnded(null);
      void jobs.start(key, run);
    },
    cancel: () => jobs.cancel(key),
    /** Back to nothing shown: Đóng, or another run of the screen starting. */
    clear: () => setEnded(null),
  };
}
