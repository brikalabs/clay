/**
 * Tiny live preview rendered on every non-color token row. Shows the
 * value as the user is editing — a corner of a card for radius, a
 * floating chip for shadow, the actual letterforms for font-family,
 * an animated dot for motion, etc.
 */

import type { ResolvedTokenSpec } from '@brika/clay/tokens';

interface TokenVisualProps {
  readonly token: ResolvedTokenSpec;
  readonly value: string;
}

export function TokenVisual({ token, value }: TokenVisualProps) {
  switch (token.type) {
    case 'radius':
      return (
        <span
          aria-hidden
          className="inline-block size-7 shrink-0 border-2 border-clay-strong/60"
          style={{ borderRadius: value, borderRightColor: 'transparent', borderBottomColor: 'transparent' }}
        />
      );
    case 'border-width':
      return (
        <span
          aria-hidden
          className="inline-block size-7 shrink-0 rounded-control"
          style={{ border: `${value} ${token.name === 'border-style' ? value : 'solid'} var(--border)` }}
        />
      );
    case 'border-style':
      return (
        <span
          aria-hidden
          className="inline-block size-7 shrink-0 rounded-control"
          style={{ border: `2px ${value} var(--clay-strong, #444)` }}
        />
      );
    case 'shadow':
      return (
        <span
          aria-hidden
          className="inline-block h-6 w-9 shrink-0 rounded-control bg-clay-elevated"
          style={{ boxShadow: value }}
        />
      );
    case 'duration':
      return <DurationVisual value={value} />;
    case 'easing':
      return <EasingVisual value={value} />;
    case 'font-family':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40 px-2 text-xs"
          style={{ fontFamily: value }}
        >
          Aa
        </span>
      );
    case 'font-size':
    case 'line-height':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40 px-2"
          style={{ fontSize: value, lineHeight: token.type === 'line-height' ? value : undefined }}
        >
          Aa
        </span>
      );
    case 'font-weight':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40 px-2 text-sm"
          style={{ fontWeight: value }}
        >
          Aa
        </span>
      );
    case 'letter-spacing':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40 px-2 text-xs"
          style={{ letterSpacing: value }}
        >
          AaBbCc
        </span>
      );
    case 'text-transform':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40 px-2 text-xs"
          style={{ textTransform: value as never }}
        >
          aa
        </span>
      );
    case 'opacity':
      return (
        <span
          aria-hidden
          className="relative inline-block size-7 shrink-0 overflow-hidden rounded-control"
          style={{
            background:
              'repeating-conic-gradient(#ddd 0 25%, transparent 0 50%) 50% / 8px 8px, var(--clay-elevated, #fff)',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-1 rounded-sm bg-clay-strong"
            style={{ opacity: Number.parseFloat(value) || 0 }}
          />
        </span>
      );
    case 'blur':
      return (
        <span
          aria-hidden
          className="relative inline-block size-7 shrink-0 overflow-hidden rounded-control"
          style={{
            background:
              'linear-gradient(135deg, var(--primary, #888) 0%, var(--accent, #ccc) 100%)',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${value})`, WebkitBackdropFilter: `blur(${value})` }}
          />
        </span>
      );
    case 'corner-shape':
      return (
        <span
          aria-hidden
          className="inline-block size-7 shrink-0 bg-clay-strong"
          style={{ borderRadius: '0.375rem', cornerShape: value as never } as React.CSSProperties}
        />
      );
    case 'size':
      return (
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-clay-canvas/40"
        >
          <span
            className="block bg-clay-strong"
            style={{ width: value, height: value, maxWidth: '100%', maxHeight: '100%' }}
          />
        </span>
      );
    default:
      return null;
  }
}

function DurationVisual({ value }: { readonly value: string }) {
  // CSS `animation-duration` accepts the same string we hold.
  return (
    <span
      aria-hidden
      className="relative inline-block h-7 w-12 shrink-0 overflow-hidden rounded-control bg-clay-canvas/40"
    >
      <span
        className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-clay-strong"
        style={{
          animation: `tb-dot ${value} ease-in-out infinite alternate`,
        }}
      />
      <style>{`@keyframes tb-dot { from { left: 4px; } to { left: calc(100% - 12px); } }`}</style>
    </span>
  );
}

function EasingVisual({ value }: { readonly value: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-7 w-12 shrink-0 overflow-hidden rounded-control bg-clay-canvas/40"
    >
      <span
        className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-clay-strong"
        style={{
          animation: `tb-easing 1.4s ${value} infinite alternate`,
        }}
      />
      <style>{`@keyframes tb-easing { from { left: 4px; } to { left: calc(100% - 12px); } }`}</style>
    </span>
  );
}
