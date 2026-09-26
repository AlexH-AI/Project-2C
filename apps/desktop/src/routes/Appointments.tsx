import { parseDate, type CalendarDate } from '@p2c/domain';
import { DataTable, type DataTableColumn } from '@p2c/ui';
import { t } from '../i18n';

interface Appointment {
  id: string;
  date: CalendarDate;
  time: string;
  customer: string;
}

function sample(id: string, date: string, time: string, customer: string): Appointment {
  const day = parseDate(date);
  if (!day) throw new RangeError(`Bad sample date ${date}`);
  return { id, date: day, time, customer };
}

// Placeholder rows until appointments come from the database (Phase 3).
const SAMPLE: Appointment[] = [
  sample('a1', '30/09/2026', '14:00', 'Trần Ngọc Mai'),
  sample('a2', '01/10/2026', '09:30', 'An Văn Bình'),
  sample('a3', '20/12/2025', '16:00', 'Bùi Minh Khoa'),
  sample('a4', '28/09/2026', '08:00', 'Âu Thị Hà'),
  sample('a5', '03/10/2026', '10:15', 'Lê Quốc Huy'),
  sample('a6', '15/08/2026', '19:45', 'Đặng Thu Trang'),
];

const COLUMNS: ReadonlyArray<DataTableColumn<Appointment>> = [
  { id: 'date', header: t('appointments.date'), kind: 'date', value: (row) => row.date },
  { id: 'time', header: t('appointments.time'), kind: 'text', value: (row) => row.time },
  {
    id: 'customer',
    header: t('appointments.customer'),
    kind: 'text',
    value: (row) => row.customer,
  },
];

export function Appointments() {
  return (
    <section className="rounded-lg border border-border bg-surface-1 p-4">
      <DataTable
        label={t('appointments.sample')}
        columns={COLUMNS}
        rows={SAMPLE}
        getRowId={(row) => row.id}
        initialSort={{ id: 'date', desc: true }}
      />
    </section>
  );
}
