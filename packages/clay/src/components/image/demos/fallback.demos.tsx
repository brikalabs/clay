import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';

/**
 * Fallback demo: the src is deliberately broken so the `ImageFallback` slot
 * (the broken-image icon) is shown immediately. Use this pattern for
 * graceful degradation when an image URL is unknown or may fail.
 */
export default function ImageFallbackDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src="/this-image-does-not-exist.png" alt="Missing image" className="size-full">
        <ImageFallback>
          <ImageOff className="size-6" />
        </ImageFallback>
      </Image>
    </div>
  );
}
