import lcrm from '../assets/brand/heritas-lcrm.png';
import tree from '../assets/brand/heritas-tree.png';
import wordmark from '../assets/brand/heritas-wordmark.png';
import { t } from '../i18n';

/**
 * The top of the sidebar (T-308, G3 27/10): the Owner's logo in three pieces, in its own colours on
 * the dark sidebar, and its slogan in real text under it. A thin champagne outline lifts the navy
 * tree and "Heritas" off the dark; "L-CRM" is gold already. The pieces are cut at 3x the size they
 * show; their own size, given, keeps the sidebar from moving as they load. A screen reader reads
 * the name of the app for them, and the slogan as the English it is (WCAG 3.1.2).
 */
export function Brand() {
  return (
    <div className="flex flex-col items-center">
      <div role="img" aria-label={t('app.title')} className="flex flex-col items-center">
        <img src={tree} alt="" width={264} height={247} className="brand-outline h-auto w-22" />
        <img
          src={wordmark}
          alt=""
          width={450}
          height={111}
          className="brand-outline mt-1.5 h-auto w-37.5"
        />
        <img src={lcrm} alt="" width={395} height={38} className="mt-1 h-auto w-33" />
      </div>
      <p lang="en" className="brand-slogan mt-1.75">
        {t('app.slogan')}
      </p>
    </div>
  );
}
