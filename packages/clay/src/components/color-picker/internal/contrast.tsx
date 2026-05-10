/**
 * WCAG contrast row. Locale-free by design — every cell renders as
 * the swatch (`Aa` over the comparison color), the ratio number,
 * and a `·` / `AA` / `AA·lg` verdict. No "vs" prefix, no language.
 */

import { contrastRatio } from '../color-utils';

function wcagVerdict(ratio: number): string {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA·lg';
  return '·';
}

export function ContrastRow({ hex }: Readonly<{ hex: string }>) {
  const onWhite = contrastRatio(hex, '#ffffff');
  const onBlack = contrastRatio(hex, '#000000');
  if (onWhite === null && onBlack === null) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-color-picker-border border-t px-3 py-2 font-mono text-[0.625rem] text-muted-foreground">
      <ContrastBadge ratio={onWhite} on="#fff" against={hex} />
      <ContrastBadge ratio={onBlack} on="#000" against={hex} />
    </div>
  );
}

function ContrastBadge({
  ratio,
  on,
  against,
}: Readonly<{ ratio: number | null; on: string; against: string }>) {
  if (ratio === null) return null;
  return (
    <span className="flex items-center gap-1.5" aria-label={`Contrast vs ${on}: ${ratio.toFixed(1)}, ${wcagVerdict(ratio)}`}>
      <span
        aria-hidden
        className="grid aspect-square size-4 shrink-0 place-items-center rounded-full ring-1 ring-color-picker-border"
        style={{ background: on, color: against }}
      >
        Aa
      </span>
      <span aria-hidden>
        {ratio.toFixed(1)} · {wcagVerdict(ratio)}
      </span>
    </span>
  );
}
