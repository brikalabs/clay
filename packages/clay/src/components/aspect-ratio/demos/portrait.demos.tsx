import { AspectRatio } from '@brika/clay/components/aspect-ratio';

/** 3/4 portrait ratio, common for product photos and editorial images. */
export default function AspectRatioPortraitDemo() {
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
