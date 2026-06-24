import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';

/**
 * A deliberately broken src triggers the `ImageFallback` slot, showing the broken-image icon in place of the photo.
 */
export default function ImageFallbackDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src="https://picsum.photos/this-404s" alt="Missing image" className="size-full">
        <ImageFallback>
          <ImageOff className="size-6" />
        </ImageFallback>
      </Image>
    </div>
  );
}
