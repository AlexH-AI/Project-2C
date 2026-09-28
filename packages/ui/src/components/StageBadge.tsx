import type { CustomerStage } from '@p2c/domain';

const COLORS: Record<CustomerStage, string> = {
  N4: 'text-n4',
  N3: 'text-n3',
  N2: 'text-n2',
  N1: 'text-n1',
  ON_HOLD: 'text-on-hold',
  LOST: 'text-lost',
};

/** Stage pill in the stage colour (mockup `.badge.st-*`); the caller passes the translated label. */
export function StageBadge({ stage, label }: { stage: CustomerStage; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-current px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${COLORS[stage]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
