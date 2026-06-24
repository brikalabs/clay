'use client';

import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';
import { SAMPLE_A, SAMPLE_B } from './images';

const IMAGES = [SAMPLE_A, SAMPLE_B];

/**
 * A button swaps between two real picsum photos, triggering the A-to-B crossfade where the previous photo stays visible at full opacity until the new one fades in completely.
 */
export default function ImageTransitionDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="h-40 w-64 overflow-hidden rounded-lg">
        <Image src={IMAGES[index]} alt="Crossfading photo" className="size-full">
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
