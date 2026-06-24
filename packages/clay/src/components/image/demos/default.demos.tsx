import { ImageOff } from 'lucide-react';
import { Image, ImageFallback } from '@brika/clay/components/image';

/** Default image with skeleton loading. */
export default function ImageDefaultDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src="https://picsum.photos/seed/clay/640/320" alt="A sample landscape photo">
        <ImageFallback>
          <ImageOff className="size-6" />
        </ImageFallback>
      </Image>
    </div>
  );
}
