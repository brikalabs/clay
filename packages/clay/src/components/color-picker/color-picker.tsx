/**
 * Designer-grade color picker. Saturation × value pad, hue slider,
 * alpha track, format tabs (hex / rgb / hsl), one-click pills for the
 * three special CSS keywords, recent-colors strip, and live WCAG
 * contrast badges. Built from Clay primitives — every interactive
 * control is a Clay component, so theming and focus states match
 * the rest of the library.
 *
 * **Locale-free by design.** The picker carries no translatable text,
 * only universally-understood symbols (HEX/RGB/HSL color-space
 * abbreviations, `°` and `%` units, the `Aa` contrast swatch, the
 * literal CSS keywords `currentColor` / `transparent` / `inherit`).
 * Screen-reader labels are passed through `aria-label` so consumers
 * can localise them via the i18n layer of their choice.
 *
 * Controlled-only. `value` may be:
 *   - any 3 / 4 / 6 / 8-digit hex (alpha handled);
 *   - one of the special CSS keywords (the picker exposes them as
 *     pills and keeps the visual controls live, so any drag commits
 *     a real color and exits the keyword automatically);
 *   - any other CSS color string the consumer wants to round-trip.
 */

'use client';

import { History, Pipette, X } from 'lucide-react';
import { cn } from '../../primitives/cn';
import { Button } from '../button';
import { ToggleGroup, ToggleGroupItem } from '../toggle-group';
import {
  type SpecialKeyword,
  SPECIAL_KEYWORDS,
  hasEyeDropper,
  hexToHsv,
  isSpecialKeyword,
  pickWithEyeDropper,
} from './color-utils';
import { ColorPickerSwatch } from './color-picker-swatch';
import { checkerboardBg } from './internal/checkerboard';
import { ContrastRow } from './internal/contrast';
import { FormatFields } from './internal/format-fields';
import { AlphaSlider, HueSlider, SatValPad } from './internal/sliders';
import { FORMATS, type Format, usePickerState } from './internal/use-picker-state';

export interface ColorPickerProps {
  readonly value: string;
  readonly onChange: (next: string) => void;
  /** Defaults to the full set; pass `[]` to hide the special pills. */
  readonly specialKeywords?: readonly SpecialKeyword[];
  /** Defaults to `true`. Set false for opaque-only pickers. */
  readonly showAlpha?: boolean;
  /** Defaults to `true`. */
  readonly showContrast?: boolean;
  /** Defaults to `true`. Auto-hidden when `window.EyeDropper` is unavailable. */
  readonly showEyedropper?: boolean;
  /** Render an "✕" close button on the right edge of the header. */
  readonly onClose?: () => void;
  /** Recently-picked colors shown beneath the inputs. */
  readonly recentColors?: readonly string[];
  /** Called when the user clicks the swatch to save its value to recents. */
  readonly onAddRecent?: (value: string) => void;
  readonly className?: string;
}

export function ColorPicker({
  value,
  onChange,
  specialKeywords = SPECIAL_KEYWORDS,
  showAlpha = true,
  showContrast = true,
  showEyedropper = true,
  onClose,
  recentColors = [],
  onAddRecent,
  className,
}: ColorPickerProps) {
  const { hsv, alpha, format, currentHex, commit, setFormat } = usePickerState({
    value,
    onChange,
    showAlpha,
  });

  const activeSpecial = isSpecialKeyword(value)
    ? (value.trim().toLowerCase() as Lowercase<SpecialKeyword>)
    : null;

  const togglePill = (keyword: SpecialKeyword) => {
    // Clicking an active pill restores the hex the visual controls
    // were already showing, so users have a reversible way out.
    onChange(activeSpecial === keyword.toLowerCase() ? currentHex : keyword);
  };

  const handleEyedropper = async () => {
    const picked = await pickWithEyeDropper();
    if (!picked) return;
    const parsed = hexToHsv(picked);
    if (parsed) {
      commit(parsed, 1);
      onAddRecent?.(picked);
    }
  };

  const eyedropperVisible = showEyedropper && hasEyeDropper();
  const headerHasContent =
    specialKeywords.length > 0 || eyedropperVisible || onClose;

  return (
    <div
      data-slot="color-picker"
      aria-label="Color picker"
      className={cn(
        'w-80 overflow-hidden rounded-color-picker border border-color-picker-border bg-color-picker-surface-container text-color-picker-surface-label shadow-color-picker',
        className
      )}
    >
      {headerHasContent && (
        <div className="flex items-center justify-between gap-2 border-color-picker-border border-b bg-card/40 px-3 py-2">
          <SpecialPills
            keywords={specialKeywords}
            activeSpecial={activeSpecial}
            onToggle={togglePill}
          />
          <div className="flex items-center gap-1">
            {eyedropperVisible && (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={handleEyedropper}
                aria-label="Eyedropper"
                className="rounded-full"
              >
                <Pipette />
              </Button>
            )}
            {onClose && (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full"
              >
                <X />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 p-3">
        <SatValPad
          hue={hsv.h}
          s={hsv.s}
          v={hsv.v}
          onChange={(s, v) => commit({ ...hsv, s, v }, alpha)}
        />
        <HueSlider hue={hsv.h} onChange={(h) => commit({ ...hsv, h }, alpha)} />
      </div>

      {showAlpha && (
        <div className="px-3 pb-3">
          <AlphaSlider hsv={hsv} alpha={alpha} onChange={(a) => commit(hsv, a)} />
        </div>
      )}

      <div className="flex flex-col gap-2 px-3 pb-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onAddRecent?.(currentHex)}
            disabled={!onAddRecent}
            aria-label="Save to recent"
            className="overflow-hidden"
            style={checkerboardBg(currentHex)}
          />
          <ToggleGroup
            type="single"
            value={format}
            onValueChange={(next) => {
              if (next) setFormat(next as Format);
            }}
            className="flex-1"
          >
            {FORMATS.map((f) => (
              <ToggleGroupItem
                key={f}
                value={f}
                size="sm"
                className="flex-1 font-mono text-[0.625rem] tracking-widest uppercase"
              >
                {f}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <FormatFields
          format={format}
          hsv={hsv}
          alpha={alpha}
          showAlpha={showAlpha}
          onCommit={commit}
        />
      </div>

      {recentColors.length > 0 && (
        <RecentStrip colors={recentColors} onPick={onChange} />
      )}

      {showContrast && <ContrastRow hex={currentHex} />}
    </div>
  );
}

function SpecialPills({
  keywords,
  activeSpecial,
  onToggle,
}: Readonly<{
  keywords: readonly SpecialKeyword[];
  activeSpecial: Lowercase<SpecialKeyword> | null;
  onToggle: (keyword: SpecialKeyword) => void;
}>) {
  if (keywords.length === 0) return <div />;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {keywords.map((keyword) => {
        const active = activeSpecial === keyword.toLowerCase();
        return (
          <Button
            key={keyword}
            type="button"
            size="sm"
            variant={active ? 'default' : 'outline'}
            aria-pressed={active}
            onClick={() => onToggle(keyword)}
            className="h-6 rounded-full px-2.5 font-mono text-[0.625rem] tracking-wide"
          >
            {keyword}
          </Button>
        );
      })}
    </div>
  );
}

function RecentStrip({
  colors,
  onPick,
}: Readonly<{ colors: readonly string[]; onPick: (value: string) => void }>) {
  return (
    <div className="flex items-center gap-2 border-color-picker-border border-t px-3 py-2.5">
      <History
        aria-hidden
        className="size-3 shrink-0 text-muted-foreground"
      />
      <div className="flex flex-1 flex-wrap gap-1.5">
        {colors.slice(0, 12).map((c, i) => (
          <button
            key={`${c}-${i}`}
            type="button"
            onClick={() => onPick(c)}
            aria-label={`Use ${c}`}
            title={c}
            className="inline-flex aspect-square size-5 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-picker-marker"
          >
            <ColorPickerSwatch value={c} className="size-full rounded-full ring-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

export { ColorPickerSwatch, type ColorPickerSwatchProps } from './color-picker-swatch';
