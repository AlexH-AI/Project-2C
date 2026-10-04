import { useState } from 'react';
import { rescheduleAppointment, type AppointmentRecord } from '@p2c/db';
import { weekdayOf } from '@p2c/domain';
import { Dialog } from '@p2c/ui';
import { useAppData } from '../../data/AppDataContext';
import { errorMessage, t } from '../../i18n';
import { Actions, ALERT } from '../customers/CustomerDialogs';
import { RescheduleFields, useRescheduleForm, whenText } from './RescheduleFields';
import { statusLabel, type AppointmentRow } from './appointments-view';

/**
 * Mockup 6e: a scheduled appointment moves to a new day. The old one stays as rescheduled, with
 * the reason in its note; a new one takes the same RE, trigger and coordinators (D3). The outcome
 * dialog offers the same as its "Dời lịch" status; this is the shortcut (Owner 29/09/2026).
 */
export function RescheduleDialog({
  row,
  onClose,
  onMoved,
}: {
  row: AppointmentRow;
  onClose: () => void;
  onMoved: (appointment: AppointmentRecord) => void;
}) {
  const app = useAppData();
  const old = row.appointment;
  const today = app.today();
  const form = useRescheduleForm(old, today);
  const [failure, setFailure] = useState<string>();

  const save = () => {
    const when = form.submit();
    if (!when) return;
    try {
      const moved = app.run((db) => rescheduleAppointment(db, old.id, when, form.reason));
      onMoved(moved);
      onClose();
    } catch (error) {
      setFailure(errorMessage(error));
    }
  };

  return (
    <Dialog
      title={t('reschedule.title')}
      subtitle={t('reschedule.sub', {
        customer: row.customer?.name ?? '',
        weekday: t(`weekdayLong.${weekdayOf(old.date)}`),
        when: whenText(old),
        status: statusLabel(old, today).text,
      })}
      onClose={onClose}
      onSubmit={save}
      actions={<Actions onClose={onClose} save={t('reschedule.save')} />}
    >
      {failure && (
        <p role="alert" className={`${ALERT} border-danger text-danger`}>
          {failure}
        </p>
      )}
      <RescheduleFields form={form} onEdit={() => setFailure(undefined)} autoFocus />
    </Dialog>
  );
}
