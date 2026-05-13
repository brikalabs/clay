import { AspectRatio } from '@brika/clay/components/aspect-ratio';

/** 4/3 ratio, traditional video and presentation format. */
export default function AspectRatioVideoDemo() {
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
