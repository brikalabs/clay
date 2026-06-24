import * as React from 'react';

import { cn } from '../../primitives/cn';

type ImageStatus = 'loading' | 'loaded' | 'error';

const ImageContext = React.createContext<{ status: ImageStatus } | null>(null);

function useImageContext() {
  const ctx = React.useContext(ImageContext);
  if (!ctx) throw new Error('ImageFallback must be used inside Image');
  return ctx;
}

/**
 * Image with a skeleton pulse while loading and a compound slot for fallback
 * content when the source fails, times out, or is absent.
 *
 * A load that neither succeeds nor errors within `timeoutMs` is treated as
 * failed, so a hanging image host still shows the fallback.
 *
 * On `src` change a crossfade keeps the previously loaded image visible until
 * the new source finishes loading, then fades the new one in over it.
 * Duration is controlled by the `--image-transition-duration` token (default 300ms).
 *
 * Compose with `ImageFallback` to provide custom error content:
 * ```tsx
 * <Image src={url} alt="...">
 *   <ImageFallback><ImageOff /></ImageFallback>
 * </Image>
 * ```
 */
function Image({
  src,
  alt = '',
  className,
  loading = 'lazy',
  timeoutMs = 5000,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  /** URL of the image to load. Changing `src` resets the loader. */
  readonly src?: string;
  /** Alt text passed to the underlying `<img>`. Use `""` for decorative images. */
  readonly alt?: string;
  /** Native `loading` attribute. Defaults to `"lazy"`. */
  readonly loading?: 'lazy' | 'eager';
  /**
   * Milliseconds before a stalled load is treated as an error.
   * Prevents a hanging image host from blocking the fallback indefinitely.
   */
  readonly timeoutMs?: number;
}) {
  const [status, setStatus] = React.useState<ImageStatus>(() => (src ? 'loading' : 'error'));

  // The previously successfully loaded src: stays visible during the next load
  // so there is no flash of skeleton between two images.
  const [prevSrc, setPrevSrc] = React.useState<string | undefined>(undefined);

  // `src` is a dependency on purpose: switching the source resets the loader.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on src change
  React.useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const timer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current));
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [src, timeoutMs]);

  function handleLoad() {
    setStatus('loaded');
    // Promote the current src to the retained layer once it is ready.
    setPrevSrc(src);
  }

  const transitionStyle: React.CSSProperties = {
    transitionDuration: 'var(--image-transition-duration)',
  };

  return (
    <ImageContext.Provider value={{ status }}>
      <div
        data-slot="image"
        data-status={status}
        className={cn('relative overflow-hidden bg-image-fallback-bg', className)}
        {...props}
      >
        {/* Skeleton pulse: only while loading and no retained previous image */}
        {status === 'loading' && !prevSrc ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-image-skeleton-color"
          />
        ) : null}

        {children}

        {/* Retained previous image: visible during the crossfade of the next src */}
        {prevSrc && status === 'loading' ? (
          <img
            src={prevSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}

        {/* Current image: fades in once loaded */}
        {src && status !== 'error' ? (
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onLoad={handleLoad}
            onError={() => setStatus('error')}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity',
              status === 'loaded' ? 'opacity-100' : 'opacity-0',
            )}
            style={transitionStyle}
          />
        ) : null}
      </div>
    </ImageContext.Provider>
  );
}

/**
 * Fallback slot rendered inside `Image` when the source fails, times out, or
 * is absent. Children are passed through unchanged -- wrap an icon, text, or
 * any React node.
 *
 * Hidden while the image is loading or has loaded successfully.
 */
function ImageFallback({ className, ...props }: React.ComponentProps<'div'>) {
  const { status } = useImageContext();

  if (status !== 'error') return null;

  return (
    <div
      data-slot="image-fallback"
      aria-hidden="true"
      className={cn(
        'flex size-full items-center justify-center text-image-fallback-icon-color',
        className,
      )}
      {...props}
    />
  );
}

export { Image, ImageFallback };
