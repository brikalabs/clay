import { AspectRatio } from '@brika/clay/components/aspect-ratio';

/** 16/9 ratio, the standard for responsive images and video embeds. */
export default function AspectRatioDefaultDemo() {
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
