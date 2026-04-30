import { AspectRatio } from '@brika/clay/components/aspect-ratio';
import { defineDemos } from '../_registry';

/** 16/9 ratio — the standard for responsive images and video embeds. */
export function AspectRatioDefaultDemo() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm rounded-lg">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  );
}

/** Square ratio — useful for profile photos, avatars, and thumbnails. */
export function AspectRatioSquareDemo() {
  return (
    <div className="w-40 overflow-hidden rounded-lg">
      <AspectRatio ratio={1}>
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm rounded-lg">
          1 / 1
        </div>
      </AspectRatio>
    </div>
  );
}

/** 4/3 ratio — traditional video and presentation format. */
export function AspectRatioVideoDemo() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg">
      <AspectRatio ratio={4 / 3}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground text-sm rounded-lg">
          <span className="font-medium">4 / 3</span>
          <span className="text-xs">Classic video format</span>
        </div>
      </AspectRatio>
    </div>
  );
}

/** 3/4 portrait ratio — common for product photos and editorial images. */
export function AspectRatioPortraitDemo() {
  return (
    <div className="w-40 overflow-hidden rounded-lg">
      <AspectRatio ratio={3 / 4}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground text-sm rounded-lg">
          <span className="font-medium">3 / 4</span>
          <span className="text-xs">Portrait</span>
        </div>
      </AspectRatio>
    </div>
  );
}

export const demoMeta = defineDemos([
  [AspectRatioDefaultDemo, 'Default', { description: `16/9 ratio — the standard for responsive images and video embeds.` }],
  [AspectRatioSquareDemo, 'Square', { description: `Square ratio — useful for profile photos, avatars, and thumbnails.` }],
  [AspectRatioVideoDemo, 'Video', { description: `4/3 ratio — traditional video and presentation format.` }],
  [AspectRatioPortraitDemo, 'Portrait', { description: `3/4 portrait ratio — common for product photos and editorial images.` }],
]);
export const accessibility: readonly string[] = [
  `The container is purely presentational — no ARIA role or keyboard behavior.`,
  `Content placed inside inherits normal focus order; ensure images carry meaningful \`alt\` text.`,
];
