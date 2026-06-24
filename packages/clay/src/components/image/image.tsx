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
 * the new source finishes fading in over it (true A->B crossfade). The
 * previous layer is only unmounted once the opacity transition on the new
 * image completes (`onTransitionEnd`), so the two layers overlap for the full
 * duration. Duration is controlled by the `--image-transition-duration` token
 * (default 300ms).
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

  // The previously successfully loaded src. Stays rendered as a bottom layer
  // for the full duration of the crossfade. Promoted to undefined only AFTER
  // the new image's opacity transition ends (not on load), so both layers
  // coexist during the fade: true A -> B crossfade.
  const [prevSrc, setPrevSrc] = React.useState<string | undefined>(undefined);

  // The src whose load has finished, and the live timeout. Together they make
  // the loader race-free: a load event that beats the effect (data-URIs decode
  // instantly), a re-run, or StrictMode can no longer reset a completed load
  // back to 'loading', and the timeout can never error an image that already
  // loaded.
  const loadedSrc = React.useRef<string | undefined>(undefined);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on src change
  React.useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }
    if (loadedSrc.current === src) {
      setStatus('loaded'); // this src already loaded; do not re-arm the timeout
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current));
    }, timeoutMs);
    return () => clearTimeout(timer.current);
  }, [src, timeoutMs]);

  function handleLoad() {
    loadedSrc.current = src;
    clearTimeout(timer.current); // a completed load must never time out into the fallback
    setStatus('loaded');
    // Do NOT promote prevSrc here: the new image is still at opacity-0 at this
    // instant. We keep the previous layer visible underneath until the fade-in
    // transition completes (see handleTransitionEnd).
  }

  function handleError() {
    clearTimeout(timer.current);
    setStatus('error');
  }

  // Called on the current <img>'s transitionend. Once the opacity animation
  // finishes we no longer need the previous layer; unmounting it here ensures
  // the two layers overlapped for the full transition duration (true crossfade).
  function handleTransitionEnd(event: React.TransitionEvent<HTMLImageElement>) {
    if (event.propertyName !== 'opacity') return;
    // Only promote when the current src finished fading in successfully.
    if (status === 'loaded' && src) {
      setPrevSrc(src);
    }
  }

  const transitionStyle: React.CSSProperties = {
    // Fallback duration so the fade (and its transitionend) always runs: a missing
    // token var resolves to 0s, which skips transitionend and breaks the crossfade.
    transitionDuration: 'var(--image-transition-duration, 300ms)',
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

        {/* Previous image bottom layer: stays at full opacity beneath the new
            image for the entire crossfade duration. Unmounted only after the
            new image's opacity transition ends (handleTransitionEnd). */}
        {prevSrc && prevSrc !== src ? (
          <img
            src={prevSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}

        {/* Current image: fades in once loaded, over the previous layer */}
        {src && status !== 'error' ? (
          <img
            // Key on src: each new source is a fresh element starting at opacity-0,
            // so the fade-in always replays over the retained previous layer.
            key={src}
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            onTransitionEnd={handleTransitionEnd}
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
