/**
 * Builds a tiny synthetic sample image entirely in-memory so demos can show
 * the cropper working without any network fetch or checked-in binary assets.
 *
 * Technique: a static inline SVG string (no canvas, no document) wrapped in a
 * File via the File constructor. File is available globally in Node 20+ / Bun,
 * so module evaluation is SSR-safe. The cropper draws the File to a canvas on
 * the client only (inside an effect), and an SVG with explicit width/height
 * sizes correctly via drawImage.
 *
 * The guard below ensures module evaluation never throws on environments where
 * File is not yet a global (older Node, edge runtimes without Fetch API). In
 * those cases makeSampleImageFile returns null, and callers omit defaultImage.
 *
 * The image is deliberately light (white/near-white background) so the dim
 * scrim outside the crop circle reads as a soft grey rather than opaque black.
 */

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e8e4de"/>
    </radialGradient>
  </defs>
  <!-- light warm-white background -->
  <rect width="512" height="512" fill="url(#bg)"/>
  <!-- soft light-grey grid (every 64 px) for pan/zoom orientation -->
  <g stroke="rgba(0,0,0,0.07)" stroke-width="1">
    <line x1="64"  y1="0"   x2="64"  y2="512"/>
    <line x1="128" y1="0"   x2="128" y2="512"/>
    <line x1="192" y1="0"   x2="192" y2="512"/>
    <line x1="256" y1="0"   x2="256" y2="512"/>
    <line x1="320" y1="0"   x2="320" y2="512"/>
    <line x1="384" y1="0"   x2="384" y2="512"/>
    <line x1="448" y1="0"   x2="448" y2="512"/>
    <line x1="0"   y1="64"  x2="512" y2="64"/>
    <line x1="0"   y1="128" x2="512" y2="128"/>
    <line x1="0"   y1="192" x2="512" y2="192"/>
    <line x1="0"   y1="256" x2="512" y2="256"/>
    <line x1="0"   y1="320" x2="512" y2="320"/>
    <line x1="0"   y1="384" x2="512" y2="384"/>
    <line x1="0"   y1="448" x2="512" y2="448"/>
  </g>
  <!-- muted neutral shapes to make rotation/pan obvious -->
  <circle cx="256" cy="220" r="72" fill="rgba(0,0,0,0.08)"/>
  <ellipse cx="256" cy="340" rx="100" ry="36" fill="rgba(0,0,0,0.05)"/>
  <rect x="176" y="176" width="160" height="8" rx="4" fill="rgba(0,0,0,0.1)"/>
</svg>`;

/** Returns a File whose content is a 512x512 light-background SVG, or null if
 *  the File global is unavailable in the current runtime (SSR guard). */
export function makeSampleImageFile(name = 'sample.svg'): File | null {
  if (typeof File === 'undefined') return null;
  return new File([SVG], name, { type: 'image/svg+xml' });
}
