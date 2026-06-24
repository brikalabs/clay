import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';
import { LANDSCAPE_A } from './offline-images';

/**
 * Default image that always loads (inline SVG, no network required).
 * The image fades in from the skeleton once it is ready.
 */
export default function ImageDefaultDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src={LANDSCAPE_A} alt="A warm gradient landscape" className="size-full">
        <ImageFallback>
          <ImageOff className="size-6" />
        </ImageFallback>
      </Image>
    </div>
  );
}
