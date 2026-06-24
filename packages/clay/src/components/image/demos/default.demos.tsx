import { Image } from '@brika/clay/components/image';

/** Default image with skeleton loading and a timeout-based error fallback. */
export default function ImageDefaultDemo() {
  return (
    <div className="h-40 w-64 overflow-hidden rounded-lg">
      <Image src="https://picsum.photos/seed/clay/640/320" alt="A sample landscape photo" />
    </div>
  );
}
