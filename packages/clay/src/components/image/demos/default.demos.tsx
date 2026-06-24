import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';
import { SAMPLE_A } from './images';

/**
 * A real photo loaded from a picsum URL, with a skeleton pulse while loading and an `ImageFallback` icon shown if the source fails.
 */
export default function ImageDefaultDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src={SAMPLE_A} alt="A landscape photo" className="size-full">
        <ImageFallback>
          <ImageOff className="size-6" />
        </ImageFallback>
      </Image>
    </div>
  );
}
