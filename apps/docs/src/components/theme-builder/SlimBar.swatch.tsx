/**
 * Brand-color swatch with click-to-edit ColorPicker. Used in
 * `SlimBar`'s identity strip. Extracted so the hero file stays
 * compact.
 */

import { ColorPicker } from '@brika/clay/components/color-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@brika/clay/components/tooltip';
import { TOKENS_BY_NAME } from '@brika/clay/tokens';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { type Draft, effectiveValue, tokenDraftKey } from './state/draft';

interface BrandSwatchProps {
  readonly name: string;
  readonly draft: Draft;
  readonly setValue: (key: string, value: string) => void;
  readonly resetValue: (key: string) => void;
}

export function BrandSwatch({ name, draft, setValue, resetValue: _resetValue }: BrandSwatchProps) {
  const token = TOKENS_BY_NAME[name];
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [recent, setRecent] = useState<readonly string[]>([]);

  // Position the popover below the trigger, viewport-fixed via portal.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;
    const reposition = () => {
      const rect = trigger.getBoundingClientRect();
      const W = popoverRef.current?.offsetWidth ?? 320;
      const H = popoverRef.current?.offsetHeight ?? 480;
      let top = rect.bottom + 8;
      if (top + H > window.innerHeight - 12) top = Math.max(12, rect.top - H - 8);
      let left = rect.left;
      if (left + W > window.innerWidth - 12) left = Math.max(12, window.innerWidth - W - 12);
      setCoords({ top, left });
    };
    reposition();
    const raf = requestAnimationFrame(reposition);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open]);

  // Click-outside dismiss.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!token) return null;
  const lightKey = tokenDraftKey(token, 'light');
  if (!lightKey) return null;
  const value = effectiveValue(draft, token, 'light');

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((p) => !p)}
              aria-label={`Edit ${name}`}
              className="aspect-square size-7 shrink-0 rounded-md border border-clay-hairline shadow-sm ring-0 transition-all hover:scale-110 hover:ring-2 hover:ring-clay-strong/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-strong/40"
              style={{ background: value }}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="font-mono text-[0.625rem]">
            {name} · {value}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-50"
            style={
              coords
                ? { top: coords.top, left: coords.left }
                : { top: -9999, left: -9999, visibility: 'hidden' }
            }
          >
            <ColorPicker
              value={value}
              onChange={(next) => setValue(lightKey, next)}
              onClose={() => setOpen(false)}
              recentColors={recent}
              onAddRecent={(hex) =>
                setRecent((p) => [hex, ...p.filter((c) => c !== hex)].slice(0, 10))
              }
            />
          </div>,
          document.body
        )}
    </>
  );
}
