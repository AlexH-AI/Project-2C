import lcrm from '../assets/brand/heritas-lcrm.png';
import tree from '../assets/brand/heritas-tree-outlined.png';
import tree2x from '../assets/brand/heritas-tree-outlined@2x.png';
import wordmark from '../assets/brand/heritas-wordmark-outlined.png';
import wordmark2x from '../assets/brand/heritas-wordmark-outlined@2x.png';
import { t } from '../i18n';

/**
 * The top of the sidebar (mockup app-shell.html `#sidebar`, G3 11/11): the compact logo, the three
 * pieces of the Owner's logo (T-308, G3 27/10) in a row, the tree 42 px wide, then "Heritas",
 * 108 px, over "L-CRM", in their own colours on the dark sidebar. A thin champagne outline lifts
 * the navy tree and "Heritas" off the dark; "L-CRM" is gold already.
 *
 * The outline is in the two images: the pieces as Edge draws them with the approved outline, four
 * `drop-shadow` of half a pixel in `--brand-outline`, captured at 1x and at 2x with 1 px of room
 * around the piece, which the margin takes back. Drawn by the web view, the outline did not show in
 * the macOS app (L179). Their own size, given, keeps the sidebar from moving as they load. A screen
 * reader reads the name of the app for them.
 */
export function Brand() {
  return (
    <div
      role="img"
      aria-label={t('app.title')}
      className="flex items-center gap-2.5 px-2 pt-0.5 pb-2"
    >
      <img
        src={tree}
        srcSet={`${tree} 1x, ${tree2x} 2x`}
        alt=""
        width={44}
        height={42}
        className="-m-px h-auto w-11 max-w-none"
      />
      <div>
        <img
          src={wordmark}
          srcSet={`${wordmark} 1x, ${wordmark2x} 2x`}
          alt=""
          width={110}
          height={29}
          className="-m-px h-auto w-27.5 max-w-none"
        />
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
