import type { CustomerStage } from '@p2c/domain';

const COLORS: Record<CustomerStage, string> = {
  N4: 'text-n4',
  N3: 'text-n3',
  N2: 'text-n2',
  N1: 'text-n1',
  ON_HOLD: 'text-on-hold',
  LOST: 'text-lost',
};

/**
 * Stage label in the stage colour, on that colour mixed into the background (mockup components.html
 * 07 `.st.dot`); the caller passes the translated label.
 */
export function StageBadge({ stage, label }: { stage: CustomerStage; label: string }) {
  return (
    <span
      className={`label-fill inline-flex h-5 items-center gap-1.25 rounded-chip px-2 text-xs font-bold whitespace-nowrap ${COLORS[stage]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
