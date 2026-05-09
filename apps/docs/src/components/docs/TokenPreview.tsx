import type { ResolvedTokenSpec } from '@brika/clay/tokens';
import type { CSSProperties, ReactNode } from 'react';

const STRONG = 'var(--text-color-clay-strong)';
const HAIRLINE = 'var(--color-clay-hairline)';

/** Photoshop-style 2-color checker. Painted under the `color` swatch so a
 *  non-opaque value (`transparent`, `color-mix(... transparent)`, alpha < 1)
 *  reveals it; opaque values fully cover it and the checker disappears. */
const CHECKER_BG: CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, ${HAIRLINE} 25%, transparent 25%),
    linear-gradient(-45deg, ${HAIRLINE} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${HAIRLINE} 75%),
    linear-gradient(-45deg, transparent 75%, ${HAIRLINE} 75%)
  `,
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
};

/** Generic 40×40 preview tile with a hairline border and rounded corners.
 *  `surface` picks the background tone — `canvas` is the page bg (default),
 *  `base` is a slightly darker tone used to make light shadows visible. */
function Box({
  surface = 'canvas',
  className = '',
  style,
  children,
}: {
  readonly surface?: 'canvas' | 'base';
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
}) {
  const bg = surface === 'base' ? 'bg-clay-base' : 'bg-clay-canvas';
  return (
    <span
      aria-hidden
      className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-clay-hairline ${bg} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** Wider preview tile (40×56) used by the `size` swatch so adjacent length
 *  tokens (1rem vs 1.5rem vs 2rem) read as visibly different. */
function WideBox({ children }: { readonly children?: ReactNode }) {
  return (
    <span
      aria-hidden
      className="relative grid h-10 w-14 shrink-0 place-items-center overflow-hidden rounded-md border border-clay-hairline bg-clay-canvas"
    >
      {children}
    </span>
  );
}

/** Renders a small, type-aware visualization of a token's value. The CSS
 *  variable is referenced live so each preview reflects the current theme. */
export function TokenPreview({ token }: { readonly token: ResolvedTokenSpec }) {
  const v = `var(--${token.name})`;

  switch (token.type) {
    case 'color':
      return (
        <Box style={CHECKER_BG}>
          <span className="absolute inset-0" style={{ backgroundColor: v }} />
        </Box>
      );

    case 'shadow':
      return (
        <Box surface="base">
          <span className="block size-6 rounded-sm bg-clay-elevated" style={{ boxShadow: v }} />
        </Box>
      );

    case 'radius':
      return (
        <Box>
          <span
            className="block size-7 border border-clay-strong/50 bg-clay-strong/15"
            style={{ borderRadius: `min(${v}, 50%)` }}
          />
        </Box>
      );

    case 'size':
      return (
        <WideBox>
          <span
            className="absolute inset-0 m-auto block rounded-sm bg-clay-strong"
            style={{
              width: `min(${v}, calc(100% - 6px))`,
              height: `min(${v}, calc(100% - 6px))`,
              minWidth: '1px',
              minHeight: '1px',
            }}
          />
        </WideBox>
      );

    case 'border-width':
      return (
        <Box>
          <span
            className="block size-6 bg-clay-canvas"
            style={{ border: `min(${v}, 12px) solid ${STRONG}` }}
          />
        </Box>
      );

    case 'border-style':
      return (
        <Box>
          <span className="block size-6" style={{ border: `2px ${v} ${STRONG}` }} />
        </Box>
      );

    case 'duration':
    case 'easing': {
      const animation: CSSProperties =
        token.type === 'duration'
          ? { animationDuration: v, animationTimingFunction: 'cubic-bezier(.4,0,.6,1)' }
          : { animationDuration: '1.4s', animationTimingFunction: v };
      return (
        <Box>
          <span
            className="block size-2 animate-ping rounded-full bg-clay-strong"
            style={{ ...animation, animationIterationCount: 'infinite' }}
          />
        </Box>
      );
    }

    case 'font-family':
      return (
        <Box>
          <span
            className="text-clay-strong leading-none"
            style={{ fontFamily: v, fontSize: '0.875rem', fontWeight: 500 }}
          >
            Ag
          </span>
        </Box>
      );

    case 'font-size':
      return (
        <Box>
          <span
            className="text-clay-strong leading-none"
            style={{ fontSize: `clamp(0.55rem, ${v}, 1.5rem)` }}
          >
            Ag
          </span>
        </Box>
      );

    case 'font-weight':
      return (
        <Box>
          <span
            className="text-clay-strong leading-none"
            style={{ fontWeight: v, fontSize: '0.9375rem' }}
          >
            Ag
          </span>
        </Box>
      );

    case 'line-height':
      return (
        <Box>
          <span
            className="block max-h-full overflow-hidden text-[0.5rem] text-clay-strong"
            style={{ lineHeight: v }}
          >
            ──
            <br />
            ──
            <br />
            ──
          </span>
        </Box>
      );

    case 'letter-spacing':
      return (
        <Box>
          <span
            className="font-mono text-[0.6875rem] text-clay-strong leading-none"
            style={{ letterSpacing: v }}
          >
            AVA
          </span>
        </Box>
      );

    case 'text-transform':
      return (
        <Box>
          <span
            className="text-[0.6875rem] text-clay-strong leading-none"
            style={{ textTransform: v as CSSProperties['textTransform'] }}
          >
            aBc
          </span>
        </Box>
      );

    case 'corner-shape':
      return (
        <Box>
          <span
            className="block size-7 bg-clay-strong/80"
            style={
              {
                cornerShape: v,
                WebkitCornerShape: v,
                borderRadius: '35%',
              } as CSSProperties
            }
          />
        </Box>
      );

    case 'opacity':
      // Solid foreground over the lightest surface available, so low values
      // (0.08, 0.12) still read as a faint tint and 1.0 reads as full strong.
      return (
        <span
          aria-hidden
          className="relative grid size-10 shrink-0 overflow-hidden rounded-md border border-clay-hairline bg-clay-elevated"
        >
          <span className="absolute inset-0 bg-clay-strong" style={{ opacity: v }} />
        </span>
      );

    case 'blur': {
      // High-contrast text behind the blur layer makes 0px vs Npx visibly
      // different. The blurred layer overlays the text so its sharpness reads
      // as the blur strength.
      return (
        <Box>
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-bold font-mono text-[0.75rem] text-clay-strong tracking-tighter leading-none"
          >
            Ag
          </span>
          <span
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${v})`,
              WebkitBackdropFilter: `blur(${v})`,
              backgroundColor: 'color-mix(in oklch, var(--color-clay-canvas) 40%, transparent)',
            }}
          />
        </Box>
      );
    }
  }

  // Exhaustive switch above — fallback exists so a future TokenType added
  // without a case still renders a visible placeholder rather than nothing.
  return (
    <Box>
      <span className="font-mono text-[0.5rem] text-clay-subtle">{token.type}</span>
    </Box>
  );
}
