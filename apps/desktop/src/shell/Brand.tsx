import lcrm from '../assets/brand/heritas-lcrm.png';
import tree from '../assets/brand/heritas-tree.png';
import wordmark from '../assets/brand/heritas-wordmark.png';
import { t } from '../i18n';

/**
 * The top of the sidebar (mockup app-shell.html `#sidebar`, G3 11/11): the compact logo, the three
 * pieces of the Owner's logo (T-308, G3 27/10) in a row, the tree, then "Heritas" over "L-CRM", in
 * their own colours on the dark sidebar. A thin champagne outline lifts the navy tree and "Heritas"
 * off the dark; "L-CRM" is gold already. Their own size, given, keeps the sidebar from moving as
 * they load. A screen reader reads the name of the app for them.
 */
export function Brand() {
  return (
    <div
      role="img"
      aria-label={t('app.title')}
      className="flex items-center gap-2.5 px-2 pt-0.5 pb-2"
    >
      <img src={tree} alt="" width={264} height={247} className="brand-outline h-auto w-10.5" />
      <div>
        <img src={wordmark} alt="" width={450} height={111} className="brand-outline h-auto w-27" />
        <img src={lcrm} alt="" width={395} height={38} className="mt-1 h-auto w-23.75" />
      </div>
    </div>
  );
}

/** The slogan of the logo, at the foot of the sidebar: read as the English it is (WCAG 3.1.2). */
export function Slogan() {
  return (
    <p lang="en" className="brand-slogan m-0">
      {t('app.slogan')}
    </p>
  );
}
