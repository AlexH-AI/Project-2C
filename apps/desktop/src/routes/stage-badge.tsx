import type { CustomerStage } from '@p2c/domain';
import { StageBadge } from '@p2c/ui';
import { t } from '../i18n';

/**
 * A stage as its badge, named by i18n as everywhere: the one helper of every screen (T-298). The
 * "Bản ghi" cell of Thùng rác passes the words of `recordBadge`, which its restore button reads.
 */
export const stageBadge = (stage: CustomerStage, label = t(`stage.${stage}`)) => (
  <StageBadge stage={stage} label={label} />
);
