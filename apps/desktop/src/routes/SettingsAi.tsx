import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  AiError,
  checkConnection,
  type AiOpencodePlan,
  type AiProvider,
  type AiReasoningLevel,
  type AiSettings,
  type ConnectionResult,
} from '@p2c/ai';
import { Button, Choices, Dialog, SelectField, TextField } from '@p2c/ui';
import { useAppData } from '../data/AppDataContext';
import type { OpenCodeClient } from '../data/ai-tauri';
import { t } from '../i18n';
import { errorText } from './ai-error-view';
import {
  checkKey,
  checkShown,
  modelList,
  modelOptions,
  problemText,
  reasoningOptions,
  takesReasoning,
  type CheckShown,
  type KeyError,
} from './settings-ai-view';

const CARD = 'flex flex-col gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3 text-sm';
const HEADING = 'm-0 text-sm font-medium text-heading';
const BADGE = 'rounded-full border border-current px-2 py-0.5 text-xs font-semibold';
const ALERT = 'm-0 flex flex-col gap-1 rounded-md border px-3 py-2';

function CardHead({ id, title, meta }: { id: string; title: string; meta?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <h2 id={id} className={HEADING}>
        {title}
      </h2>
      {meta}
    </div>
  );
}

/** A thrown error as a §5.3 message; anything but an `AiError` is a bug: the general one. */
const failureText = (error: unknown) =>
  error instanceof AiError ? errorText(error) : t('aiError.GENERAL');

/**
 * Cài đặt → AI (mockup ai.html 1a–1g, 4a–4c; spec Phase 5 §4, §9.3): provider, gói OpenCode,
 * model and reasoning saved at once into the data, the key kept by Rust, the connection check and
 * what is sent. Web mode has no Rust: OpenCode is off and only the Mock runs (1c).
 */
export function AiSection() {
  const data = useAppData();
  const { ai } = data;
  // Saving goes through `run`, so the stored settings are read again on every change.
  useSyncExternalStore(data.subscribe, data.revision);
  const { settings, problem } = ai.stored();
  const provider = ai.settings().provider;
  const save = (change: Partial<AiSettings>) => ai.save({ ...settings, ...change });
  const opencode = provider === 'OPENCODE_GO';

  return (
    <div className="flex flex-col gap-4">
      {problem && (
        <p role="note" className={`${ALERT} border-warn text-sm`}>
          {problemText(problem)}
        </p>
      )}
      <section aria-labelledby="ai-model-title" className={CARD}>
        <CardHead
          id="ai-model-title"
          title={t('settingsAi.modelTitle')}
          meta={<span className="text-xs text-fg-3">{t('settingsAi.modelMeta')}</span>}
        />
        <Choices<AiProvider>
          label={t('settingsAi.provider')}
          value={provider}
          options={[
            { value: 'MOCK', label: t('settingsAi.provider.MOCK') },
            {
              value: 'OPENCODE_GO',
              label: t('settingsAi.provider.OPENCODE_GO'),
              disabled: !ai.opencode,
            },
          ]}
          onChange={(value) => save({ provider: value })}
          help={
            ai.opencode ? t(`settingsAi.providerHelp.${provider}`) : t('settingsAi.providerWeb')
          }
        />
        {opencode && (
          <Choices<AiOpencodePlan>
            label={t('settingsAi.plan')}
            value={settings.opencodePlan}
            options={[
              { value: 'GO', label: t('settingsAi.plan.GO') },
              { value: 'CREDIT', label: t('settingsAi.plan.CREDIT') },
            ]}
            onChange={(value) => save({ opencodePlan: value })}
            help={t('settingsAi.planHelp')}
          />
        )}
        <SelectField
          label={t('settingsAi.model')}
          value={settings.model}
          options={modelOptions()}
          disabled={!opencode}
          onChange={(value) => save({ model: value as AiSettings['model'] })}
          help={
            opencode
              ? t('settingsAi.modelHelp', { models: modelList() })
              : t('settingsAi.modelMock')
          }
        />
        <SelectField
          label={t('settingsAi.reasoning')}
          value={settings.reasoning}
          options={reasoningOptions()}
          disabled={!opencode || !takesReasoning(settings.model)}
          onChange={(value) => save({ reasoning: value as AiReasoningLevel })}
          help={takesReasoning(settings.model) ? undefined : t('settingsAi.reasoningOff')}
        />
      </section>
      {ai.opencode ? (
        <KeyCard client={ai.opencode} />
      ) : (
        <section aria-labelledby="ai-key-title" className={CARD}>
          <CardHead id="ai-key-title" title={t('settingsAi.keyTitle')} />
          <p className="m-0 text-fg-3">{t('settingsAi.keyWeb')}</p>
        </section>
      )}
      <ConnectionCard mock={!opencode} />
      <SentCard />
    </div>
  );
}

type KeyOutcome =
  | { readonly kind: 'saved' }
  | { readonly kind: 'error'; readonly text: string; readonly notSaved: boolean };

/** The key (mockup 1a, 1d, 1e): written only, never shown again; its status comes from Rust. */
function KeyCard({ client }: { client: OpenCodeClient }) {
  const [stored, setStored] = useState<boolean>();
  const [text, setText] = useState('');
  const [fieldError, setFieldError] = useState<KeyError>();
  const [outcome, setOutcome] = useState<KeyOutcome>();
  const [working, setWorking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // Once a save or a delete starts, the status read at the start is out of date (DR5-37).
  const acted = useRef(false);

  useEffect(() => {
    let current = true;
    const fresh = () => current && !acted.current;
    client.keyStatus().then(
      (value) => fresh() && setStored(value),
      (error: unknown) =>
        fresh() && setOutcome({ kind: 'error', text: failureText(error), notSaved: false }),
    );
    return () => {
      current = false;
    };
  }, [client]);

  const saveKey = async () => {
    // The field's error never sits beside the outcome of the save before (DR5-46).
    setOutcome(undefined);
    const checked = checkKey(text);
    if ('error' in checked) {
      setFieldError(checked.error);
      return;
    }
    setFieldError(undefined);
    acted.current = true;
    setWorking(true);
    try {
      await client.setKey(checked.key);
      setText('');
      setStored(true);
      setOutcome({ kind: 'saved' });
    } catch (error) {
      setOutcome({ kind: 'error', text: failureText(error), notSaved: true });
    } finally {
      setWorking(false);
    }
  };

  const deleteKey = async () => {
    setOutcome(undefined);
    acted.current = true;
    setWorking(true);
    try {
      await client.deleteKey();
      setStored(false);
    } catch (error) {
      setOutcome({ kind: 'error', text: failureText(error), notSaved: false });
    } finally {
      setWorking(false);
      setConfirming(false);
    }
  };

  return (
    <section aria-labelledby="ai-key-title" className={CARD}>
      <CardHead
        id="ai-key-title"
        title={t('settingsAi.keyTitle')}
        meta={
          stored !== undefined && (
            <span className={`${BADGE} ${stored ? 'text-ok' : 'text-warn'}`}>
              {t(stored ? 'settingsAi.keyStored' : 'settingsAi.keyMissing')}
            </span>
          )
        }
      />
      <form
        className="flex flex-wrap items-start gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!working) void saveKey();
        }}
      >
        <div className="min-w-0 flex-1">
          <TextField
            label={t(stored ? 'settingsAi.keyNew' : 'settingsAi.key')}
            value={text}
            onChange={setText}
            // Hidden while pasted and after a save that failed, as it stays to try again (DR5-32).
            type="password"
            spellCheck={false}
            placeholder={t(stored ? 'settingsAi.keyNewPlaceholder' : 'settingsAi.keyPlaceholder')}
            error={fieldError && t(`settingsAi.keyError.${fieldError}`)}
            disabled={working}
          />
        </div>
        <span className="pt-6">
          <Button type="submit" variant="primary" disabled={working}>
            {t('settingsAi.keySave')}
          </Button>
        </span>
      </form>
      <p className="m-0 text-xs text-fg-3">{t('settingsAi.keyHelp')}</p>
      {outcome?.kind === 'saved' && (
        <p role="status" className="m-0 text-ok">
          {t('settingsAi.keySaved')}
        </p>
      )}
      {outcome?.kind === 'error' && (
        <div role="alert" className={`${ALERT} border-danger`}>
          <b>{outcome.text}</b>
          {outcome.notSaved && <span className="text-fg-2">{t('settingsAi.keyNotSaved')}</span>}
        </div>
      )}
      {stored && (
        <div>
          <Button variant="danger" disabled={working} onClick={() => setConfirming(true)}>
            {t('settingsAi.keyDeleteOpen')}
          </Button>
        </div>
      )}
      {confirming && (
        <Dialog
          title={t('settingsAi.keyDeleteTitle')}
          subtitle={t('settingsAi.keyDeleteSub')}
          onClose={working ? undefined : () => setConfirming(false)}
          actions={
            <>
              <Button disabled={working} onClick={() => setConfirming(false)}>
                {t('settingsAi.cancel')}
              </Button>
              <Button variant="danger" disabled={working} onClick={() => void deleteKey()}>
                {t('settingsAi.keyDelete')}
              </Button>
            </>
          }
        >
          <p className="m-0 text-fg-2">{t('settingsAi.keyDeleteBody')}</p>
        </Dialog>
      )}
    </section>
  );
}

/**
 * Kiểm tra kết nối (1b, 1f, 4a): through the app's one runner (P5), so it is off while any AI
 * request runs; no Hủy, the request is 64 tokens at most. The Mock needs no connection.
 */
function ConnectionCard({ mock }: { mock: boolean }) {
  const { ai } = useAppData();
  const { runner } = ai;
  const busy = useSyncExternalStore(runner.subscribe, () => runner.busy);
  const [shown, setShown] = useState<CheckShown>({ phase: 'idle' });

  const check = async () => {
    const call = ai.call();
    setShown({ phase: 'running' });
    let result: ConnectionResult | null;
    try {
      result = await checkConnection(call);
    } catch (error) {
      ai.reportError(error);
      result = null;
    }
    setShown(checkShown(result, call.settings));
  };

  return (
    <section aria-labelledby="ai-check-title" className={CARD}>
      <CardHead
        id="ai-check-title"
        title={t('settingsAi.checkTitle')}
        meta={<span className="text-xs text-fg-3">{t('settingsAi.checkMeta')}</span>}
      />
      {mock ? (
        <p className="m-0 text-fg-3">{t('settingsAi.checkMock')}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={busy} onClick={() => void check()}>
            {t('settingsAi.check')}
          </Button>
          {shown.phase === 'running' && (
            <span role="status" className="text-fg-3">
              {t('settingsAi.checkRunning')}
            </span>
          )}
          {shown.phase !== 'running' && busy && (
            <span className="text-xs text-fg-3">{t('aiError.AI_BUSY')}</span>
          )}
          {shown.phase === 'ok' && !busy && (
            <span role="status">
              <b className="text-ok">{t('settingsAi.checkOk')}</b> {shown.detail}
            </span>
          )}
          {shown.phase === 'error' && !busy && (
            <span role="alert" className="text-danger">
              {shown.text}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

/** What each way of using AI sends (§6.1, §9.3; mockup 1a, 4a). */
function SentCard() {
  return (
    <section aria-labelledby="ai-sent-title" className={CARD}>
      <CardHead id="ai-sent-title" title={t('settingsAi.sentTitle')} />
      <ul className="m-0 flex flex-col gap-1 pl-4.5 text-fg-2">
        <li>
          <b className="text-fg">{t('settingsAi.sentAnalysisLead')}</b>{' '}
          {t('settingsAi.sentAnalysis')}
        </li>
        <li>
          <b className="text-fg">{t('settingsAi.sentExtractionLead')}</b>{' '}
          {t('settingsAi.sentExtraction')}
        </li>
        <li>{t('settingsAi.sentChatgpt')}</li>
        <li>{t('settingsAi.sentCheck')}</li>
      </ul>
    </section>
  );
}
