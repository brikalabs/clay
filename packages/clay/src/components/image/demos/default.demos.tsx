import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';
import { SAMPLE_A } from './images';

/**
 * Default image loaded from a real photo URL. The image fades in from the
 * skeleton once it is ready; if the load fails, the broken-image icon shows.
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
