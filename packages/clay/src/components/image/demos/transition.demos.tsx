'use client';

import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';
import { LANDSCAPE_A, LANDSCAPE_B } from './offline-images';

const IMAGES = [LANDSCAPE_A, LANDSCAPE_B];

/**
 * Crossfade on src change: toggling between two inline SVG images shows the
 * smooth transition. The previous image stays visible until the next one has
 * finished loading, then the new image fades in over it with no skeleton flash.
 */
export default function ImageTransitionDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="h-40 w-64 overflow-hidden rounded-lg">
        <Image src={IMAGES[index]} alt="Crossfading landscape" className="size-full">
          <ImageFallback>
            <ImageOff className="size-6" />
          </ImageFallback>
        </Image>
      </div>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % IMAGES.length)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Swap image
      </button>
    </div>
  );
}
