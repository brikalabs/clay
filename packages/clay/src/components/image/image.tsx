import { ImageOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../primitives/cn';

type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Image with a muted skeleton while loading and a fallback when the source
 * fails or stalls. A load that neither succeeds nor errors within `timeoutMs`
 * counts as failed, so a hanging image host still shows the fallback.
 */
function Image({
  src,
  alt = '',
  className,
  imgClassName,
  fallback,
  loading = 'lazy',
  timeoutMs = 5000,
  ...props
}: React.ComponentProps<'div'> & {
  /** URL of the image to load. Changing `src` resets the loader. */
  readonly src: string;
  /** Alt text passed to the underlying `<img>`. Use `""` for decorative images. */
  readonly alt?: string;
  /** className applied to the inner `<img>` element. */
  readonly imgClassName?: string;
  /** Content rendered when the image fails or times out. Defaults to an `ImageOff` icon. */
  readonly fallback?: React.ReactNode;
  /** Native `loading` attribute. Defaults to `"lazy"`. */
  readonly loading?: 'lazy' | 'eager';
  /**
   * Milliseconds before a stalled load is treated as an error.
   * Prevents a hanging image host from blocking the fallback indefinitely.
   */
  readonly timeoutMs?: number;
}) {
  const [status, setStatus] = React.useState<ImageStatus>('loading');

  // `src` is a dependency on purpose: switching the source resets the loader.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on src change
  React.useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current));
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [src, timeoutMs]);

  return (
    <div
      data-slot="image"
      data-status={status}
      className={cn('relative overflow-hidden bg-image-fallback-bg', className)}
      {...props}
    >
      {status === 'loading' ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-image-skeleton-color"
        />
      ) : null}

      {status === 'error'
        ? (fallback ?? (
            <div
              aria-hidden="true"
              className="flex size-full items-center justify-center text-image-fallback-icon-color"
            >
              <ImageOff className="size-6" />
            </div>
          ))
        : null}

      {status === 'error' ? null : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'size-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
        />
      )}
    </div>
  );
}

export { Image };
