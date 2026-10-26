import type { CustomerStage } from '@p2c/domain';
import { StageBadge } from '@p2c/ui';
import { t } from '../i18n';

/** A stage as its badge, named by i18n as everywhere: the one helper of every screen (T-298). */
export const stageBadge = (stage: CustomerStage) => (
  <StageBadge stage={stage} label={t(`stage.${stage}`)} />
);
