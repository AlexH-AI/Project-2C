import { useState, type ReactNode } from 'react';
import { softDeleteAppointment, type AppointmentRecord, type CustomerRecord } from '@p2c/db';
import { formatDayMonth, isRfTransition, type StageTransition } from '@p2c/domain';
import { Button, Dialog } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { ALERT, FailureAlert } from '../customers/CustomerDialogs';
import { badge } from './MetFields';
import { whenText } from './RescheduleFields';
import { statusLabel } from './appointments-view';

/**
 * Mockup 6g: deleting an appointment takes back the stage move it made, when it is the latest
 * (D7); the KYC notes stay. An appointment that moved nothing (a planned one, say) leaves the stage
 * and RF as they are. The deletion is soft (D4).
 */
export function DeleteAppointmentDialog({
  appointment: a,
  customer,
  caused,
  onClose,
  onDeleted,
}: {
  appointment: AppointmentRecord;
  customer: CustomerRecord;
  caused?: StageTransition;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const app = useAppData();
  const [failure, setFailure] = useState<string>();
  const remove = () => {
    try {
      app.run((db) => softDeleteAppointment(db, a.id));
      onDeleted();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };
  return (
    <Dialog
      title={t('appointmentDelete.title', { when: whenText(a) })}
      subtitle={t('appointmentDelete.sub', {
        customer: customer.name,
        status: statusLabel(a, app.today()).text,
      })}
      onClose={onClose}
      onSubmit={remove}
      actions={
        <>
          <Button onClick={onClose}>{t('customerForm.cancel')}</Button>
          <Button type="submit" variant="danger">
            {t('outcomeEdit.delete')}
          </Button>
        </>
      }
    >
      {failure && <FailureAlert>{failure}</FailureAlert>}
      <p className="m-0 text-fg-2">
        {t(caused?.from ? 'appointmentDelete.moved' : 'appointmentDelete.noMove')}
      </p>
      <Facts
        facts={[
          ...undoneFacts(caused),
          [t('appointmentDelete.kyc'), t('appointmentDelete.kycKept')],
        ]}
      />
      <p className={`${ALERT} border-info`}>{t('appointmentDelete.soft')}</p>
    </Dialog>
  );
}

/**
 * Mockup 6f, DR6-70: saving takes back the stage move the meeting made, with nothing in its place;
 * said before as 6g says it.
 */
export function UndoneMoveNote({ caused }: { caused: StageTransition }) {
  return (
    <div role="note" className={`${ALERT} flex flex-col gap-1.5 border-info`}>
      <b>{t('outcomeEdit.onSave')}</b>
      <Facts facts={undoneFacts(caused)} />
    </div>
  );
}

/** "Nhóm KH N1 → về N2 (hủy chuyển nhóm 14/09)" and its RF once the move goes; else unchanged. */
function undoneFacts(caused: StageTransition | undefined): [string, ReactNode][] {
  const from = caused?.from;
  const move = caused && from ? { from, to: caused.to, date: caused.date } : undefined;
  return [
    [
      t('appointmentDelete.stage'),
      move ? (
        <>
          {badge(move.to)} {t('appointmentDelete.back')} {badge(move.from)}{' '}
          {t('appointmentDelete.undo', { date: formatDayMonth(move.date) })}
        </>
      ) : (
        t('appointmentDelete.unchanged')
      ),
    ],
    [
      t('appointmentDelete.rf'),
      move
        ? t(
            isRfTransition(move.from, move.to)
              ? 'appointmentDelete.rfLess'
              : 'appointmentDelete.rfSame',
            { from: t(`stage.${move.from}`), to: t(`stage.${move.to}`) },
          )
        : t('appointmentDelete.unchanged'),
    ],
  ];
}

function Facts({ facts }: { facts: readonly [string, ReactNode][] }) {
  return (
    <dl className="m-0 flex flex-col gap-1.5 tabular-nums">
      {facts.map(([term, value]) => (
        <div key={term} className="flex gap-3">
          <dt className="w-24 shrink-0 text-fg-3">{term}</dt>
          <dd className="m-0 flex flex-wrap items-center gap-1">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
