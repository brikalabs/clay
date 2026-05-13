import { AspectRatio } from '@brika/clay/components/aspect-ratio';

/** Square ratio, useful for profile photos, avatars, and thumbnails. */
export default function AspectRatioSquareDemo() {
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
