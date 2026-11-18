import lcrm from '../assets/brand/heritas-lcrm.png';
import { t } from '../i18n';

/** The images of a navy piece, one for each scale: `…/heritas-tree-outlined@1.5x.png`. */
const TREE = import.meta.glob<string>('../assets/brand/heritas-tree-outlined@*.png', {
  eager: true,
  import: 'default',
});
const WORDMARK = import.meta.glob<string>('../assets/brand/heritas-wordmark-outlined@*.png', {
  eager: true,
  import: 'default',
});

/** `src` and `srcSet` of a piece: its image at 1x, and the one of each scale a screen may have. */
function outlined(images: Record<string, string>) {
  const scaled = Object.entries(images).map(([path, url]) => ({
    url,
    scale: /@(.+x)\.png$/.exec(path)?.[1] ?? '1x',
  }));
  return {
    src: scaled.find((image) => image.scale === '1x')?.url,
    srcSet: scaled.map((image) => `${image.url} ${image.scale}`).join(','),
  };
}

/**
 * The top of the sidebar (mockup app-shell.html `#sidebar`, G3 11/11): the compact logo, the three
 * pieces of the Owner's logo (T-308, G3 27/10) in a row, the tree 42 px wide, then "Heritas",
 * 108 px, over "L-CRM", in their own colours on the dark sidebar. A thin champagne outline lifts
 * the navy tree and "Heritas" off the dark; "L-CRM" is gold already.
 *
 * The outline is in the images of those two: the pieces as Edge draws them with the approved
 * outline, four `drop-shadow` of half a pixel in `--brand-outline`, captured at each scale Windows
 * and macOS show the app at (1x to 3x). Drawn by the web view, the outline did not show in the
 * macOS app (L179). An image is a box of whole pixels at every scale, with room for the outline
 * around the piece (the tree at 1 px of 44 × 44, "Heritas" at 2 px, 1 px down, of 112 × 32): the
 * margins take that room back. Their size, given, keeps the sidebar from moving as they load. A
 * screen reader reads the name of the app for them.
 */
export function Brand() {
  return (
    <div
      role="img"
      aria-label={t('app.title')}
      className="flex items-center gap-2.5 px-2 pt-0.5 pb-2"
    >
      <img
        {...outlined(TREE)}
        alt=""
        width={44}
        height={44}
        className="-mx-px -mt-px -mb-0.75 h-auto w-11 max-w-none"
      />
      <div>
        <img
          {...outlined(WORDMARK)}
          alt=""
          width={112}
          height={32}
          className="-mx-0.5 -mt-px -mb-1 h-auto w-28 max-w-none"
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
